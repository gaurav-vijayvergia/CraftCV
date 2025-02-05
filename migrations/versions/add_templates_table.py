"""Add templates table

Revision ID: add_templates_table
Revises: initial_migration
Create Date: 2024-03-15 11:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'add_templates_table'
down_revision: Union[str, None] = '1a2b3c4d5e6f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Create templates table
    op.create_table(
        'templates',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('layout', sa.String(50), nullable=False),
        sa.Column('sections', sa.JSON, nullable=False),
        sa.Column('is_default', sa.Boolean, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'))
    )

    # Add index for faster lookups
    op.create_index('ix_templates_user_id', 'templates', ['user_id'])

def downgrade() -> None:
    op.drop_index('ix_templates_user_id', 'templates')
    op.drop_table('templates')
