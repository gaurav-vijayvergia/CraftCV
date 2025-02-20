from weasyprint import HTML, CSS
from jinja2 import Environment, FileSystemLoader
import os
from typing import Dict, Any
from ..models import CV, Organization, Template

class CVGenerator:
    def __init__(self):
        self.env = Environment(
            loader=FileSystemLoader("backend/templates")
        )
        
        # Ensure output directory exists
        os.makedirs("uploads/generated", exist_ok=True)

    async def generate_pdf(
        self,
        cv: CV,
        template: Template,
        organization: Organization,
        output_path: str
    ) -> str:
        # Load the appropriate template based on layout
        template_name = f"{template.layout}.html"
        template = self.env.get_template(template_name)
        
        # Prepare the context for the template
        context = {
            "cv_data": cv.parsed_data,
            "organization": {
                "logo_url": organization.logo_url,
                "primary_color": organization.primary_color,
                "secondary_color": organization.secondary_color,
                "font": organization.font
            },
            "template": template.sections
        }
        
        # Render the HTML
        html_content = template.render(**context)
        
        # Create CSS with dynamic values
        css = CSS(string=f"""
            :root {{
                --primary-color: {organization.primary_color};
                --secondary-color: {organization.secondary_color};
                --font-family: {organization.font}, system-ui, sans-serif;
            }}
            
            body {{
                font-family: var(--font-family);
                margin: 0;
                padding: 0;
            }}
            
            .page {{
                width: 210mm;
                min-height: 297mm;
                padding: 20mm;
                margin: 0;
            }}
            
            @page {{
                size: A4;
                margin: 0;
            }}
        """)
        
        # Generate PDF
        HTML(string=html_content).write_pdf(
            output_path,
            stylesheets=[css]
        )
        
        return output_path