"""Initial migration

Revision ID: 1a2b3c4d5e6f
Revises:
Create Date: 2024-03-15 10:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
from datetime import datetime
import uuid
from passlib.context import CryptContext

# revision identifiers, used by Alembic.
revision: str = '1a2b3c4d5e6f'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def upgrade() -> None:
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('username', sa.String(255), unique=True, nullable=False),
        sa.Column('email', sa.String(255), unique=True, nullable=False),
        sa.Column('password', sa.String(255), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'))
    )

    # Create organizations table
    op.create_table(
        'organizations',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('logo_url', sa.Text, nullable=True),
        sa.Column('primary_color', sa.String(7), server_default='#2563eb'),
        sa.Column('secondary_color', sa.String(7), server_default='#1e40af'),
        sa.Column('font', sa.String(255), server_default='Inter'),
        sa.Column('cv_template_url', sa.Text, nullable=True),
        sa.Column('theme', sa.String(10), server_default='light'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'))
    )

    # Create cvs table
    op.create_table(
        'cvs',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('original_filename', sa.String(255), nullable=False),
        sa.Column('file_url', sa.Text, nullable=False),
        sa.Column('status', sa.Enum('PROCESSING', 'CRAFTED', name='cvstatus'), server_default='PROCESSING'),
        sa.Column('parsed_data', sa.JSON, nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'))
    )

    # Create default administrator user
    users = table('users',
                  column('id', sa.String),
                  column('username', sa.String),
                  column('email', sa.String),
                  column('password', sa.String),
                  column('created_at', sa.DateTime)
                  )

    admin_id = str(uuid.uuid4())
    hashed_password = pwd_context.hash('@raft@V')

    op.bulk_insert(users, [
        {
            'id': admin_id,
            'username': 'administrator',
            'email': 'administrator@craftcv.ai',
            'password': hashed_password,
            'created_at': datetime.utcnow()
        }
    ])

    # Create default organization for administrator
    organizations = table('organizations',
                          column('id', sa.String),
                          column('user_id', sa.String),
                          column('created_at', sa.DateTime)
                          )

    op.bulk_insert(organizations, [
        {
            'id': str(uuid.uuid4()),
            'user_id': admin_id,
            'created_at': datetime.utcnow()
        }
    ])

def downgrade() -> None:
    op.drop_table('cvs')
    op.drop_table('organizations')
    op.drop_table('users')
