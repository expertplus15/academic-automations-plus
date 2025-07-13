import { supabase } from "@/integrations/supabase/client";

export interface GradeApproval {
  id: string;
  grade_id: string;
  workflow_stage: string;
  current_stage: string;
  status: 'pending' | 'approved' | 'rejected' | 'changes_requested';
  approver_id?: string;
  approval_date?: string;
  comments?: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface ApprovalHistory {
  id: string;
  approval_id: string;
  action: string;
  from_stage?: string;
  to_stage?: string;
  performer_id?: string;
  reason?: string;
  metadata: any;
  created_at: string;
}

export class ApprovalService {
  
  // Get pending approvals for current user
  static async getPendingApprovals(): Promise<any[]> {
    const { data, error } = await supabase.functions.invoke('approval-workflow/pending');
    
    if (error) {
      throw error;
    }
    
    return data || [];
  }

  // Submit grade for approval
  static async submitForApproval(gradeId: string, stage = 'teacher_entry'): Promise<GradeApproval> {
    const { data, error } = await supabase.functions.invoke('approval-workflow/submit', {
      body: {
        gradeId,
        stage,
        userId: (await supabase.auth.getUser()).data.user?.id
      }
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  // Approve grade
  static async approveGrade(approvalId: string, comments?: string, nextStage?: string): Promise<GradeApproval> {
    const { data, error } = await supabase.functions.invoke('approval-workflow/approve', {
      body: {
        approvalId,
        comments,
        nextStage,
        userId: (await supabase.auth.getUser()).data.user?.id
      }
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  // Reject grade
  static async rejectGrade(approvalId: string, reason: string): Promise<GradeApproval> {
    const { data, error } = await supabase.functions.invoke('approval-workflow/reject', {
      body: {
        approvalId,
        reason,
        userId: (await supabase.auth.getUser()).data.user?.id
      }
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  // Request changes
  static async requestChanges(approvalId: string, changes: string): Promise<GradeApproval> {
    const { data, error } = await supabase.functions.invoke('approval-workflow/request-changes', {
      body: {
        approvalId,
        changes,
        userId: (await supabase.auth.getUser()).data.user?.id
      }
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  // Get approval history
  static async getApprovalHistory(gradeId?: string): Promise<ApprovalHistory[]> {
    const { data, error } = await supabase.functions.invoke('approval-workflow/history', {
      body: { gradeId }
    });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  }

  // Get workflow stages
  static getWorkflowStages(): Array<{name: string, label: string, description: string}> {
    return [
      {
        name: 'teacher_entry',
        label: 'Saisie Enseignant',
        description: 'Note saisie par l\'enseignant'
      },
      {
        name: 'department_review',
        label: 'Révision Département',
        description: 'Vérification par le chef de département'
      },
      {
        name: 'admin_validation',
        label: 'Validation Administration',
        description: 'Validation par l\'administration'
      },
      {
        name: 'final_approval',
        label: 'Approbation Finale',
        description: 'Approbation finale par la direction'
      }
    ];
  }

  // Get current user's role in workflow
  static async getCurrentUserRole(): Promise<string> {
    // This would normally check the user's role from the database
    // For now, return a default role
    return 'teacher';
  }

  // Check if user can approve at current stage
  static async canApproveAtStage(stage: string): Promise<boolean> {
    const userRole = await this.getCurrentUserRole();
    
    const permissions = {
      'teacher_entry': ['teacher', 'admin'],
      'department_review': ['department_head', 'admin'],
      'admin_validation': ['admin'],
      'final_approval': ['director', 'admin']
    };
    
    return permissions[stage as keyof typeof permissions]?.includes(userRole) || false;
  }
}