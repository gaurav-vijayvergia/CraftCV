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
    ResponseSchema(name="personal_info", description="Personal information including name, email, phone, location"),
    ResponseSchema(name="summary", description="Professional summary or objective statement"),
    ResponseSchema(name="work_experience", description="List of work experiences with company, position, dates, and responsibilities"),
    ResponseSchema(name="education", description="Educational background including institutions, degrees, and dates"),
    ResponseSchema(name="skills", description="Technical and soft skills"),
    ResponseSchema(name="certifications", description="Professional certifications and achievements"),
]

parser = StructuredOutputParser.from_response_schemas(response_schemas)
format_instructions = parser.get_format_instructions()

PROMPT_TEMPLATE = """Extract structured information from the following CV/resume. 
Format the output as JSON according to these instructions:
{format_instructions}

CV Content:
{cv_content}
"""

chat_prompt = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)

class CVParser:
    def __init__(self):
        self.llm = ChatOpenAI(
            model_name="gpt-4",
            temperature=0,
            openai_api_key=settings.OPENAI_API_KEY
        )

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
            return parsed_data

        except Exception as e:
            print(f"Error parsing CV: {str(e)}")
            raise
