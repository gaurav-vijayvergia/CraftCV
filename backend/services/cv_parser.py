import os
from typing import Dict, Any
import PyPDF2
from docx import Document
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.output_parsers import ResponseSchema, StructuredOutputParser
from ..config import settings

# Define the schema for CV parsing
response_schemas = [
    ResponseSchema(name="personal_info", description="Personal information including name, email, phone, location as an object with fields: name, email, phone, location"),
    ResponseSchema(name="summary", description="Professional summary or objective statement"),
    ResponseSchema(name="work_experience", description="List of work experiences with company, position, dates, and responsibilities"),
    ResponseSchema(name="education", description="Educational background including institutions, degrees, and dates"),
    ResponseSchema(name="skills", description="Technical and soft skills"),
    ResponseSchema(name="certifications", description="Professional certifications and achievements"),
]

parser = StructuredOutputParser.from_response_schemas(response_schemas)
format_instructions = parser.get_format_instructions()

PROMPT_TEMPLATE = """Extract structured information from the following CV/resume. 
For personal_info, parse it into an object with name, email, phone, and location fields.
If you find a string with multiple pieces of information, split them appropriately.

Format the output as JSON according to these instructions:
{format_instructions}

CV Content:
{cv_content}
"""

chat_prompt = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)

class CVParser:
    def __init__(self):
        self.llm = ChatOpenAI(
            model_name="gpt-4o",
            temperature=0,
            openai_api_key=settings.OPENAI_API_KEY
        )

    def parse_personal_info(self, info_str: str) -> Dict[str, str]:
        """Parse personal info string into structured format."""
        # Initialize default values
        info = {
            "name": "",
            "email": "",
            "phone": "",
            "location": ""
        }

        # Split the string by commas
        parts = [part.strip() for part in info_str.split(',')]

        for part in parts:
            # Email pattern
            if '@' in part:
                info["email"] = part.strip()
            # Phone pattern (simple pattern, can be enhanced)
            elif any(c.isdigit() for c in part):
                info["phone"] = part.strip()
            # Location (usually comes last)
            elif any(location in part.lower() for location in ["singapore", "usa", "uk", "australia"]):
                info["location"] = part.strip()
            # Name (usually comes first)
            else:
                info["name"] = part.strip()

        return info

    def extract_text_from_pdf(self, file_path: str) -> str:
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text()
        return text

    def extract_text_from_docx(self, file_path: str) -> str:
        doc = Document(file_path)
        return " ".join([paragraph.text for paragraph in doc.paragraphs])

    def extract_text(self, file_path: str) -> str:
        file_extension = os.path.splitext(file_path)[1].lower()

        if file_extension == '.pdf':
            return self.extract_text_from_pdf(file_path)
        elif file_extension in ['.docx', '.doc']:
            return self.extract_text_from_docx(file_path)
        else:
            raise ValueError(f"Unsupported file format: {file_extension}")

    async def parse_cv(self, file_path: str) -> Dict[str, Any]:
        try:
            # Extract text from the CV file
            cv_text = self.extract_text(file_path)

            # Create the prompt with the CV content
            messages = chat_prompt.format_messages(
                format_instructions=format_instructions,
                cv_content=cv_text
            )

            # Get response from LLM
            response = await self.llm.agenerate([messages])
            result = response.generations[0][0].text

            # Parse the response into structured data
            parsed_data = parser.parse(result)

            # If personal_info is a string, parse it into structured format
            if isinstance(parsed_data.get("personal_info"), str):
                parsed_data["personal_info"] = self.parse_personal_info(parsed_data["personal_info"])

            return parsed_data

        except Exception as e:
            print(f"Error parsing CV: {str(e)}")
            raise
