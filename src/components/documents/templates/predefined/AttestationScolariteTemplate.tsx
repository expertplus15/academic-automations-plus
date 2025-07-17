import React from 'react';

export interface AttestationScolariteData {
  // En-tête établissement
  republique: string;
  ministere: string;
  ecole: string;
  
  // Informations document
  annee_academique: string;
  numero_attestation: string;
  
  // Informations étudiant
  nom: string;
  prenom: string;
  date_naissance: string;
  lieu_naissance: string;
  nationalite: string;
  matricule: string;
  programme: string;
  niveau: string;
  
  // Détails inscription
  statut_inscription: string;
  date_inscription: string;
  
  // Signatures et dates
  date_emission: string;
  lieu_emission: string;
  directeur_general: string;
  responsable_scolarite: string;
}

interface AttestationScolariteTemplateProps {
  data: Partial<AttestationScolariteData>;
  isEditable?: boolean;
  onDataChange?: (data: Partial<AttestationScolariteData>) => void;
}

export function AttestationScolariteTemplate({ data, isEditable = false, onDataChange }: AttestationScolariteTemplateProps) {
  const handleChange = (field: keyof AttestationScolariteData, value: any) => {
    if (onDataChange) {
      onDataChange({ ...data, [field]: value });
    }
  };

  const EditableField = ({ field, value, className = "", multiline = false }: { 
    field: keyof AttestationScolariteData; 
    value: any; 
    className?: string;
    multiline?: boolean;
  }) => {
    if (!isEditable) {
      return <span className={className}>{value || `{${field}}`}</span>;
    }
    
    if (multiline) {
      return (
        <textarea
          value={value || ''}
          onChange={(e) => handleChange(field, e.target.value)}
          className={`bg-yellow-50 border border-yellow-200 rounded px-1 resize-none ${className}`}
          placeholder={`{${field}}`}
        />
      );
    }
    
    return (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => handleChange(field, e.target.value)}
        className={`bg-yellow-50 border border-yellow-200 rounded px-1 ${className}`}
        placeholder={`{${field}}`}
      />
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-8 text-sm border" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* En-tête avec logos et informations officielles */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-black">
        <div className="flex-1">
          <div className="text-center space-y-1">
            <div className="font-bold text-sm">
              <EditableField field="republique" value={data.republique} />
            </div>
            <div className="font-bold text-xs">
              <EditableField field="ministere" value={data.ministere} />
            </div>
            <div className="text-xs">
              <EditableField field="ecole" value={data.ecole} />
            </div>
          </div>
        </div>
        
        <div className="px-4">
          <div className="w-20 h-20 bg-blue-100 border-2 border-blue-300 flex items-center justify-center text-xs font-bold">
            LOGO
            <br />
            OFFICIEL
          </div>
        </div>
        
        <div className="flex-1 text-center text-xs">
          <div className="font-bold">N° <EditableField field="numero_attestation" value={data.numero_attestation} className="w-20" /></div>
          <div className="mt-2">Année: <EditableField field="annee_academique" value={data.annee_academique} className="w-20" /></div>
        </div>
      </div>

      {/* Titre du document */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-4 text-blue-800">
          ATTESTATION DE SCOLARITÉ
        </h1>
        <div className="w-32 h-1 bg-blue-600 mx-auto mb-6"></div>
      </div>

      {/* Corps du document */}
      <div className="space-y-6 text-justify leading-relaxed">
        <p className="text-base">
          Je soussigné(e), <strong><EditableField field="directeur_general" value={data.directeur_general} className="font-bold" /></strong>, 
          Directeur Général de <strong><EditableField field="ecole" value={data.ecole} /></strong>, 
          certifie que :
        </p>

        {/* Informations de l'étudiant dans un cadre */}
        <div className="bg-gray-50 border-l-4 border-blue-600 p-6 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Nom et Prénom :</span>
              <div className="mt-1">
                <EditableField field="nom" value={data.nom} className="font-bold mr-2" />
                <EditableField field="prenom" value={data.prenom} className="font-bold" />
              </div>
            </div>
            <div>
              <span className="font-semibold">N° Matricule :</span>
              <div className="mt-1 font-mono">
                <EditableField field="matricule" value={data.matricule} className="font-bold" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Né(e) le :</span>
              <div className="mt-1">
                <EditableField field="date_naissance" value={data.date_naissance} />
              </div>
            </div>
            <div>
              <span className="font-semibold">À :</span>
              <div className="mt-1">
                <EditableField field="lieu_naissance" value={data.lieu_naissance} />
              </div>
            </div>
          </div>
          
          <div>
            <span className="font-semibold">Nationalité :</span>
            <span className="ml-2">
              <EditableField field="nationalite" value={data.nationalite} />
            </span>
          </div>
        </div>

        <p className="text-base">
          Est <strong><EditableField field="statut_inscription" value={data.statut_inscription} className="font-bold" /></strong> 
          dans notre établissement au titre de l'année académique <strong><EditableField field="annee_academique" value={data.annee_academique} /></strong> 
          en <strong><EditableField field="niveau" value={data.niveau} /></strong> 
          du programme <strong><EditableField field="programme" value={data.programme} /></strong>.
        </p>

        <p className="text-base">
          L'inscription a été effectuée en date du <strong><EditableField field="date_inscription" value={data.date_inscription} /></strong>.
        </p>

        <p className="text-base font-medium">
          En foi de quoi, la présente attestation est délivrée pour servir et valoir ce que de droit.
        </p>
      </div>

      {/* Pied de page avec date et signatures */}
      <div className="mt-12 grid grid-cols-2 gap-8">
        <div className="text-center">
          <div className="mb-8">
            Fait à <EditableField field="lieu_emission" value={data.lieu_emission} />, 
            le <EditableField field="date_emission" value={data.date_emission} />
          </div>
          
          <div className="border-t-2 border-gray-400 pt-2 mt-16">
            <div className="font-bold">LE DIRECTEUR GÉNÉRAL</div>
            <div className="mt-2 text-xs text-gray-600">Signature et cachet</div>
          </div>
        </div>

        <div className="text-center">
          <div className="mb-8">
            <strong>Visa du service de la scolarité</strong>
          </div>
          
          <div className="border-t-2 border-gray-400 pt-2 mt-16">
            <div className="font-bold">
              <EditableField field="responsable_scolarite" value={data.responsable_scolarite} />
            </div>
            <div className="mt-2 text-xs text-gray-600">Signature et cachet</div>
          </div>
        </div>
      </div>

      {/* Footer institutionnel */}
      <div className="mt-12 pt-6 border-t border-gray-300">
        <div className="text-xs text-center text-gray-600 space-y-2">
          <div className="flex justify-between items-center">
            <div className="text-left">
              <div>Adresse : Avenue de la République</div>
              <div>BP 2494 - Djibouti</div>
              <div>Tél : +253 21 35 68 78</div>
            </div>
            <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-xs">
              QR
            </div>
            <div className="text-right">
              <div>Email : contact@emd.dj</div>
              <div>Site : www.emd.dj</div>
              <div>Siret : 123 456 789 00012</div>
            </div>
          </div>
          <div className="mt-4 font-semibold text-blue-800">
            Document officiel - Toute falsification sera poursuivie
          </div>
        </div>
      </div>
    </div>
  );
}