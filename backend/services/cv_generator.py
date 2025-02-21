from weasyprint import HTML, CSS
from jinja2 import Environment, FileSystemLoader
import os
from typing import Dict, Any
from ..models import CV, Organization, Template
from ..config import settings

class CVGenerator:
    def __init__(self):
        self.env = Environment(
            loader=FileSystemLoader("backend/templates")
        )

        # Ensure output directory exists
        os.makedirs("uploads/generated", exist_ok=True)

    def get_local_path(self, url_path: str | None) -> str | None:
        """Convert URL path to local file path."""
        if not url_path:
            return None
        if url_path.startswith(('http://', 'https://')):
            return None
        # Remove leading slash if present
        if url_path.startswith('/'):
            url_path = url_path[1:]
        # Get absolute path
        return os.path.abspath(url_path)

    async def generate_pdf(
            self,
            cv: CV,
            template: Template,
            organization: Organization,
            output_path: str
    ) -> str:
        # Load the appropriate template based on layout
        template_name = f"{template.layout}.html"
        jinja_template = self.env.get_template(template_name)

        # Ensure cv_data has all required fields with defaults
        cv_data = cv.parsed_data or {}

        # Set default values for all required fields
        cv_data = {
            'personal_info': {
                'name': cv_data.get('personal_info', {}).get('name', 'No Name'),
                'email': cv_data.get('personal_info', {}).get('email', ''),
                'phone': cv_data.get('personal_info', {}).get('phone', ''),
                'location': cv_data.get('personal_info', {}).get('location', '')
            },
            'summary': cv_data.get('summary', ''),
            'work_experience': [
                                   {
                                       'company': exp.get('company', ''),
                                       'position': exp.get('position', ''),
                                       'dates': exp.get('dates', ''),
                                       'responsibilities': exp.get('responsibilities', [])
                                   }
                                   for exp in cv_data.get('work_experience', [])
                               ] or [],
            'education': [
                             {
                                 'institution': edu.get('institution', ''),
                                 'degree': edu.get('degree', ''),
                                 'dates': edu.get('dates', '')
                             }
                             for edu in cv_data.get('education', [])
                         ] or [],
            'skills': cv_data.get('skills', []),
            'certifications': cv_data.get('certifications', [])
        }

        # Filter out personal-info section
        filtered_sections = [s for s in template.sections if s.get('type') != 'personal-info']

        # Get local path for logo
        logo_path = self.get_local_path(organization.logo_url)

        # Prepare the context for the template
        context = {
            "cv_data": cv_data,
            "organization": {
                "logo_url": f"file://{logo_path}" if logo_path else None,
                "primary_color": organization.primary_color,
                "secondary_color": organization.secondary_color,
                "font": organization.font
            },
            "sections": filtered_sections
        }

        # Render the HTML
        html_content = jinja_template.render(**context)

        # Create CSS with dynamic values
        css = CSS(string=f"""
            :root {{
                --primary-color: {organization.primary_color};
                --secondary-color: {organization.secondary_color};
                --font-family: {organization.font}, system-ui, sans-serif;
            }}
            
            @page {{
                size: A4;
                margin: 0;
            }}
            
            body {{
                font-family: var(--font-family);
                margin: 0;
                padding: 0;
            }}
            
            .page {{
                width: 210mm;
                min-height: 297mm;
                padding: 15mm;
                margin: 0;
                box-sizing: border-box;
            }}
        """)

        # Generate PDF
        HTML(string=html_content).write_pdf(
            output_path,
            stylesheets=[css]
        )

        return output_path
