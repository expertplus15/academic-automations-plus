import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DocumentCard } from "./DocumentCard";

interface AttestationTabProps {
  templates: any[];
  onPreview: (templateId: string, type: string) => void;
  onGenerate: (templateId: string, type: string) => void;
  onEdit: (templateId: string) => void;
}

export function AttestationTab({ templates, onPreview, onGenerate, onEdit }: AttestationTabProps) {
  const attestationTemplates = templates.filter(t => t.type === 'attestation');

  return (
    <TabsContent value="attestations" className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Attestations</h3>
        <Button onClick={() => onEdit("")}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Attestation
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {attestationTemplates.map((template) => (
          <DocumentCard
            key={template.id}
            title={template.name}
            description={template.description || "Attestation personnalisable"}
            type="attestation"
            status="ready"
            templateId={template.id}
            onPreview={() => onPreview(template.id, 'attestation')}
            onGenerate={() => onGenerate(template.id, 'attestation')}
            onEdit={() => onEdit(template.id)}
          />
        ))}
        
        {/* Default attestation types if no templates */}
        {attestationTemplates.length === 0 && (
          <>
            <DocumentCard
              title="Attestation de Scolarité"
              description="Justificatif d'inscription pour l'année en cours"
              type="attestation"
              status="ready"
              onPreview={() => onPreview('scolarite', 'attestation')}
              onGenerate={() => onGenerate('scolarite', 'attestation')}
              onEdit={() => onEdit('scolarite')}
            />
            
            <DocumentCard
              title="Attestation de Réussite"
              description="Justificatif de réussite d'un diplôme ou niveau"
              type="attestation"
              status="ready"
              onPreview={() => onPreview('reussite', 'attestation')}
              onGenerate={() => onGenerate('reussite', 'attestation')}
              onEdit={() => onEdit('reussite')}
            />

            <DocumentCard
              title="Attestation de Présence"
              description="Justificatif d'assiduité aux cours"
              type="attestation"
              status="ready"
              onPreview={() => onPreview('presence', 'attestation')}
              onGenerate={() => onGenerate('presence', 'attestation')}
              onEdit={() => onEdit('presence')}
            />

            <DocumentCard
              title="Attestation de Diplôme"
              description="Justificatif d'obtention de diplôme en attente de parchemin"
              type="certificate"
              status="ready"
              onPreview={() => onPreview('diplome', 'certificate')}
              onGenerate={() => onGenerate('diplome', 'certificate')}
              onEdit={() => onEdit('diplome')}
            />

            <DocumentCard
              title="Relevé de Notes Provisoire"
              description="Document temporaire en attente du relevé officiel"
              type="attestation"
              status="ready"
              onPreview={() => onPreview('releve-provisoire', 'attestation')}
              onGenerate={() => onGenerate('releve-provisoire', 'attestation')}
              onEdit={() => onEdit('releve-provisoire')}
            />

            <DocumentCard
              title="Attestation de Stage"
              description="Justificatif de stage en entreprise"
              type="attestation"
              status="draft"
              onPreview={() => onPreview('stage', 'attestation')}
              onGenerate={() => onGenerate('stage', 'attestation')}
              onEdit={() => onEdit('stage')}
            />
          </>
        )}
      </div>
    </TabsContent>
  );
}