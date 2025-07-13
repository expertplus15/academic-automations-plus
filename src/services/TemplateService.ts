import { supabase } from "@/integrations/supabase/client";

export interface Template {
  id: string;
  name: string;
  type: 'bulletin' | 'transcript' | 'report' | 'custom';
  description?: string;
  content: any;
  preview_url?: string;
  is_active: boolean;
  is_default: boolean;
  version: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface TemplateVersion {
  id: string;
  template_id: string;
  version: number;
  content: any;
  changes: string;
  created_by?: string;
  created_at: string;
}

export class TemplateService {
  
  // Get all templates
  static async getTemplates(): Promise<Template[]> {
    const { data, error } = await supabase.functions.invoke('template-editor/templates');
    
    if (error) {
      throw error;
    }
    
    return data || [];
  }

  // Create new template
  static async createTemplate(templateData: {
    name: string;
    type: string;
    description?: string;
    content: any;
  }): Promise<Template> {
    const { data, error } = await supabase.functions.invoke('template-editor/create', {
      body: {
        ...templateData,
        userId: (await supabase.auth.getUser()).data.user?.id
      }
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  // Update template
  static async updateTemplate(id: string, content: any, changes?: string): Promise<Template> {
    const { data, error } = await supabase.functions.invoke('template-editor/update', {
      body: {
        id,
        content,
        changes,
        userId: (await supabase.auth.getUser()).data.user?.id
      }
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  // Delete template
  static async deleteTemplate(id: string): Promise<void> {
    const { error } = await supabase.functions.invoke('template-editor', {
      method: 'DELETE',
      body: { id }
    });
    
    if (error) {
      throw error;
    }
  }

  // Generate template preview
  static async generatePreview(templateId: string, sampleData?: any): Promise<string> {
    const { data, error } = await supabase.functions.invoke('template-editor/preview', {
      body: {
        templateId,
        sampleData
      }
    });
    
    if (error) {
      throw error;
    }
    
    return data.previewHtml;
  }

  // Get template versions
  static async getTemplateVersions(templateId: string): Promise<TemplateVersion[]> {
    const { data, error } = await supabase
      .from('template_versions')
      .select('*')
      .eq('template_id', templateId)
      .order('version', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  }

  // Get default templates by type
  static async getDefaultTemplates(): Promise<Record<string, Template[]>> {
    const templates = await this.getTemplates();
    
    return templates.reduce((acc, template) => {
      if (!acc[template.type]) {
        acc[template.type] = [];
      }
      acc[template.type].push(template);
      return acc;
    }, {} as Record<string, Template[]>);
  }
}