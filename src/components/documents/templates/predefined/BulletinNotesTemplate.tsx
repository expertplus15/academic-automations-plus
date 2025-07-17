import React from 'react';

export interface BulletinNotesData {
  // En-tête établissement
  republique: string;
  ministere: string;
  ecole: string;
  
  // Informations document
  annee_academique: string;
  periode: string;
  numero_bulletin: string;
  
  // Informations étudiant
  nom: string;
  prenom: string;
  matricule: string;
  classe: string;
  programme: string;
  niveau: string;
  
  // Matières et notes
  matieres: Array<{
    nom: string;
    code: string;
    coefficient: number;
    note_cc: number;
    note_tp: number;
    note_examen: number;
    note_finale: number;
    mention: string;
    validation: string;
    credits_ects: number;
  }>;
  
  // Moyennes et statistiques
  moyenne_generale: number;
  moyenne_classe: number;
  rang_classe: string;
  total_coefficients: number;
  total_credits: number;
  credits_obtenus: number;
  mention_generale: string;
  decision: string;
  
  // Absences et retards
  absences_justifiees: number;
  absences_non_justifiees: number;
  retards: number;
  
  // Signatures
  date_emission: string;
  lieu_emission: string;
  directeur_pedagogique: string;
  professeur_principal: string;
}

interface BulletinNotesTemplateProps {
  data: Partial<BulletinNotesData>;
  isEditable?: boolean;
  onDataChange?: (data: Partial<BulletinNotesData>) => void;
}

export function BulletinNotesTemplate({ data, isEditable = false, onDataChange }: BulletinNotesTemplateProps) {
  const handleChange = (field: keyof BulletinNotesData, value: any) => {
    if (onDataChange) {
      onDataChange({ ...data, [field]: value });
    }
  };

  const EditableField = ({ field, value, className = "", type = "text" }: { 
    field: keyof BulletinNotesData; 
    value: any; 
    className?: string;
    type?: string;
  }) => {
    if (!isEditable) {
      return <span className={className}>{value || `{${field}}`}</span>;
    }
    
    return (
      <input
        type={type}
        value={value || ''}
        onChange={(e) => handleChange(field, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
        className={`bg-yellow-50 border border-yellow-200 rounded px-1 ${className}`}
        placeholder={`{${field}}`}
      />
    );
  };

  const defaultMatieres = [
    {
      nom: 'Mathématiques Appliquées',
      code: 'MATH301',
      coefficient: 3,
      note_cc: 14.5,
      note_tp: 16.0,
      note_examen: 13.0,
      note_finale: 14.2,
      mention: 'Bien',
      validation: 'Validé',
      credits_ects: 6
    },
    {
      nom: 'Programmation Avancée',
      code: 'PROG301',
      coefficient: 4,
      note_cc: 15.5,
      note_tp: 17.0,
      note_examen: 14.0,
      note_finale: 15.1,
      mention: 'Bien',
      validation: 'Validé',
      credits_ects: 8
    },
    {
      nom: 'Base de Données',
      code: 'BDD301',
      coefficient: 3,
      note_cc: 13.0,
      note_tp: 15.5,
      note_examen: 12.5,
      note_finale: 13.4,
      mention: 'Assez Bien',
      validation: 'Validé',
      credits_ects: 6
    },
    {
      nom: 'Anglais Professionnel',
      code: 'ANG301',
      coefficient: 2,
      note_cc: 16.0,
      note_tp: 0,
      note_examen: 15.0,
      note_finale: 15.4,
      mention: 'Bien',
      validation: 'Validé',
      credits_ects: 4
    }
  ];

  const matieres = data.matieres && data.matieres.length > 0 ? data.matieres : defaultMatieres;

  return (
    <div className="w-full max-w-5xl mx-auto bg-white p-6 text-sm border" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* En-tête avec logos et informations officielles */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-blue-600">
        <div className="flex-1">
          <div className="text-center space-y-1">
            <div className="font-bold text-sm text-blue-800">
              <EditableField field="republique" value={data.republique} />
            </div>
            <div className="font-bold text-xs">
              <EditableField field="ministere" value={data.ministere} />
            </div>
            <div className="text-xs font-semibold">
              <EditableField field="ecole" value={data.ecole} />
            </div>
          </div>
        </div>
        
        <div className="px-4">
          <div className="w-20 h-20 bg-blue-100 border-2 border-blue-300 flex items-center justify-center text-xs font-bold">
            LOGO
            <br />
            ÉCOLE
          </div>
        </div>
        
        <div className="flex-1 text-center text-xs space-y-1">
          <div>Année Scolaire: <EditableField field="annee_academique" value={data.annee_academique} className="w-20 font-semibold" /></div>
          <div>Période: <EditableField field="periode" value={data.periode} className="w-24 font-semibold" /></div>
          <div>N° Bulletin: <EditableField field="numero_bulletin" value={data.numero_bulletin} className="w-20" /></div>
        </div>
      </div>

      {/* Titre du document */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-blue-800 mb-2">
          BULLETIN DE NOTES
        </h1>
        <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
      </div>

      {/* Informations étudiant */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="font-semibold text-blue-800">Identité de l'étudiant</div>
            <div className="space-y-1 mt-2">
              <div><span className="font-medium">Nom :</span> <EditableField field="nom" value={data.nom} className="font-bold" /></div>
              <div><span className="font-medium">Prénom :</span> <EditableField field="prenom" value={data.prenom} className="font-bold" /></div>
              <div><span className="font-medium">Matricule :</span> <EditableField field="matricule" value={data.matricule} className="font-mono" /></div>
            </div>
          </div>
          <div>
            <div className="font-semibold text-blue-800">Formation</div>
            <div className="space-y-1 mt-2">
              <div><span className="font-medium">Classe :</span> <EditableField field="classe" value={data.classe} /></div>
              <div><span className="font-medium">Programme :</span> <EditableField field="programme" value={data.programme} /></div>
              <div><span className="font-medium">Niveau :</span> <EditableField field="niveau" value={data.niveau} /></div>
            </div>
          </div>
          <div>
            <div className="font-semibold text-blue-800">Assiduité</div>
            <div className="space-y-1 mt-2">
              <div><span className="font-medium">Abs. justifiées :</span> <EditableField field="absences_justifiees" value={data.absences_justifiees} type="number" className="w-8" /></div>
              <div><span className="font-medium">Abs. non just. :</span> <EditableField field="absences_non_justifiees" value={data.absences_non_justifiees} type="number" className="w-8" /></div>
              <div><span className="font-medium">Retards :</span> <EditableField field="retards" value={data.retards} type="number" className="w-8" /></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des notes */}
      <div className="mb-6">
        <h3 className="font-bold mb-3 text-blue-800 bg-blue-100 p-2 rounded">Détail des Notes et Évaluations</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-2 border-blue-600 text-xs">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border border-blue-600 p-2 text-left">Matière</th>
                <th className="border border-blue-600 p-2">Code</th>
                <th className="border border-blue-600 p-2">Coef.</th>
                <th className="border border-blue-600 p-2">CC</th>
                <th className="border border-blue-600 p-2">TP</th>
                <th className="border border-blue-600 p-2">Examen</th>
                <th className="border border-blue-600 p-2">Moy.</th>
                <th className="border border-blue-600 p-2">Mention</th>
                <th className="border border-blue-600 p-2">ECTS</th>
                <th className="border border-blue-600 p-2">Validation</th>
              </tr>
            </thead>
            <tbody>
              {matieres.map((matiere, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="border border-blue-600 p-2 font-medium">{matiere.nom}</td>
                  <td className="border border-blue-600 p-2 text-center font-mono text-xs">{matiere.code}</td>
                  <td className="border border-blue-600 p-2 text-center font-bold">{matiere.coefficient}</td>
                  <td className="border border-blue-600 p-2 text-center">
                    {matiere.note_cc > 0 ? matiere.note_cc.toFixed(1) : '-'}
                  </td>
                  <td className="border border-blue-600 p-2 text-center">
                    {matiere.note_tp > 0 ? matiere.note_tp.toFixed(1) : '-'}
                  </td>
                  <td className="border border-blue-600 p-2 text-center">
                    {matiere.note_examen > 0 ? matiere.note_examen.toFixed(1) : '-'}
                  </td>
                  <td className="border border-blue-600 p-2 text-center font-bold text-blue-800">
                    {matiere.note_finale.toFixed(1)}
                  </td>
                  <td className="border border-blue-600 p-2 text-center">
                    <span className={`px-1 py-0.5 rounded text-xs font-medium ${
                      matiere.mention === 'Très Bien' ? 'bg-green-100 text-green-800' :
                      matiere.mention === 'Bien' ? 'bg-blue-100 text-blue-800' :
                      matiere.mention === 'Assez Bien' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {matiere.mention}
                    </span>
                  </td>
                  <td className="border border-blue-600 p-2 text-center font-bold">{matiere.credits_ects}</td>
                  <td className="border border-blue-600 p-2 text-center">
                    <span className={`px-1 py-0.5 rounded text-xs font-medium ${
                      matiere.validation === 'Validé' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {matiere.validation}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Moyennes et résultats */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-bold text-green-800 mb-3">Résultats et Moyennes</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Moyenne Générale:</span>
              <span className="font-bold text-lg text-green-800">
                <EditableField field="moyenne_generale" value={data.moyenne_generale} type="number" className="w-12 text-center" />/20
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Moyenne de Classe:</span>
              <span><EditableField field="moyenne_classe" value={data.moyenne_classe} type="number" className="w-12" />/20</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Rang dans la Classe:</span>
              <span className="font-bold"><EditableField field="rang_classe" value={data.rang_classe} className="w-16" /></span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Mention Générale:</span>
              <span className="font-bold text-green-800">
                <EditableField field="mention_generale" value={data.mention_generale} className="w-20" />
              </span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-bold text-blue-800 mb-3">Crédits ECTS et Validation</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Crédits Obtenus:</span>
              <span className="font-bold">
                <EditableField field="credits_obtenus" value={data.credits_obtenus} type="number" className="w-8" />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total Crédits:</span>
              <span><EditableField field="total_credits" value={data.total_credits} type="number" className="w-8" /></span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total Coefficients:</span>
              <span><EditableField field="total_coefficients" value={data.total_coefficients} type="number" className="w-8" /></span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Décision du Jury:</span>
              <span className="font-bold text-blue-800">
                <EditableField field="decision" value={data.decision} className="w-20" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-8 mt-8">
        <div className="text-center">
          <div className="mb-8">
            Fait à <EditableField field="lieu_emission" value={data.lieu_emission} />, 
            le <EditableField field="date_emission" value={data.date_emission} />
          </div>
          
          <div className="border-t-2 border-gray-400 pt-2 mt-16">
            <div className="font-bold">LE DIRECTEUR PÉDAGOGIQUE</div>
            <div className="mt-2">
              <EditableField field="directeur_pedagogique" value={data.directeur_pedagogique} />
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="mb-8">
            <strong>Visa du professeur principal</strong>
          </div>
          
          <div className="border-t-2 border-gray-400 pt-2 mt-16">
            <div className="font-bold">
              <EditableField field="professeur_principal" value={data.professeur_principal} />
            </div>
            <div className="mt-2 text-xs text-gray-600">Signature</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-300">
        <div className="text-xs text-center text-gray-600">
          <div className="font-semibold mb-2">Document confidentiel - Usage strictement personnel</div>
          <div>Ce bulletin fait foi des résultats obtenus durant la période indiquée</div>
        </div>
      </div>
    </div>
  );
}