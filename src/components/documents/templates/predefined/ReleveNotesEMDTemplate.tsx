import React from 'react';

export interface ReleveNotesEMDData {
  // En-tête établissement
  republique: string;
  ministere: string;
  ecole: string;
  
  // Informations document
  annee_academique: string;
  session: string;
  
  // Informations étudiant
  nom: string;
  niveau: string;
  systeme_etude: string;
  
  // Matières par semestre
  semestre1: Array<{
    matiere: string;
    nature_ue: string;
    credit: number;
    session: number;
    rattrapage: number;
    coefficient: number;
  }>;
  
  semestre2: Array<{
    matiere: string;
    nature_ue: string;
    credit: number;
    session: number;
    rattrapage: number;
    coefficient: number;
  }>;
  
  // Moyennes
  moyenne_generale_s1: number;
  moyenne_generale_s2: number;
  moyenne_generale: number;
  mention: string;
  decision: string;
  
  // Signatures
  date: string;
  directeur_general: string;
}

interface ReleveNotesEMDTemplateProps {
  data: Partial<ReleveNotesEMDData>;
  isEditable?: boolean;
  onDataChange?: (data: Partial<ReleveNotesEMDData>) => void;
}

export function ReleveNotesEMDTemplate({ data, isEditable = false, onDataChange }: ReleveNotesEMDTemplateProps) {
  const handleChange = (field: keyof ReleveNotesEMDData, value: any) => {
    if (onDataChange) {
      onDataChange({ ...data, [field]: value });
    }
  };

  const EditableField = ({ field, value, className = "", multiline = false }: { 
    field: keyof ReleveNotesEMDData; 
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
    <div className="w-full max-w-4xl mx-auto bg-white p-6 text-sm border" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* En-tête avec logos et informations officielles */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-black">
        <div className="flex-1">
          <div className="text-center space-y-1">
            <div className="font-bold text-xs">
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
          <div className="w-16 h-16 bg-red-200 flex items-center justify-center text-xs">
            LOGO EMD
          </div>
        </div>
        
        <div className="flex-1 text-center text-xs">
          <div>جمهورية جيبوتي</div>
          <div>وزارة التعليم العالي والبحث العلمي</div>
          <div>École de Management De Djibouti</div>
        </div>
      </div>

      {/* Titre du document */}
      <div className="text-center mb-4">
        <h1 className="text-lg font-bold border-b border-black inline-block px-8">
          RELEVÉ DE NOTES
        </h1>
      </div>

      {/* Informations générales */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <div className="flex">
            <span className="font-bold w-32">Année Académique:</span>
            <EditableField field="annee_academique" value={data.annee_academique} />
          </div>
          <div className="flex">
            <span className="font-bold w-32">Niveau:</span>
            <EditableField field="niveau" value={data.niveau} />
          </div>
          <div className="flex">
            <span className="font-bold w-32">Nom:</span>
            <EditableField field="nom" value={data.nom} />
          </div>
          <div className="flex">
            <span className="font-bold w-32">Système d'étude:</span>
            <EditableField field="systeme_etude" value={data.systeme_etude} />
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold">
            SESSION: <EditableField field="session" value={data.session} />
          </div>
        </div>
      </div>

      {/* Tableau Semestre 1 */}
      <div className="mb-4">
        <h3 className="font-bold mb-2 bg-gray-200 p-1">Semestre 1</h3>
        <table className="w-full border-collapse border border-black text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-1 text-left">Intitulé de l'unité d'enseignement</th>
              <th className="border border-black p-1">Nature de l'UE</th>
              <th className="border border-black p-1">Crédit</th>
              <th className="border border-black p-1">Session</th>
              <th className="border border-black p-1">Rattrapage</th>
              <th className="border border-black p-1">Coefficient</th>
            </tr>
          </thead>
          <tbody>
            {(data.semestre1 || []).map((matiere, index) => (
              <tr key={index}>
                <td className="border border-black p-1">{matiere.matiere}</td>
                <td className="border border-black p-1 text-center">{matiere.nature_ue}</td>
                <td className="border border-black p-1 text-center">{matiere.credit}</td>
                <td className="border border-black p-1 text-center">{matiere.session}</td>
                <td className="border border-black p-1 text-center">{matiere.rattrapage}</td>
                <td className="border border-black p-1 text-center">{matiere.coefficient}</td>
              </tr>
            ))}
            {/* Lignes par défaut si pas de données */}
            {(!data.semestre1 || data.semestre1.length === 0) && (
              <>
                <tr>
                  <td className="border border-black p-1">Comptabilité</td>
                  <td className="border border-black p-1 text-center">Fondamentale</td>
                  <td className="border border-black p-1 text-center">15.00</td>
                  <td className="border border-black p-1 text-center">7.00</td>
                  <td className="border border-black p-1 text-center">14.00</td>
                  <td className="border border-black p-1 text-center">5</td>
                </tr>
                <tr>
                  <td className="border border-black p-1">Droit de l'entreprise</td>
                  <td className="border border-black p-1 text-center">Fondamentale</td>
                  <td className="border border-black p-1 text-center">12.00</td>
                  <td className="border border-black p-1 text-center">16.00</td>
                  <td className="border border-black p-1 text-center">-</td>
                  <td className="border border-black p-1 text-center">4</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
        <div className="text-right mt-1 font-bold">
          Moyenne générale: <EditableField field="moyenne_generale_s1" value={data.moyenne_generale_s1} className="w-16" />
        </div>
      </div>

      {/* Tableau Semestre 2 */}
      <div className="mb-4">
        <h3 className="font-bold mb-2 bg-gray-200 p-1">Semestre 2</h3>
        <table className="w-full border-collapse border border-black text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-1 text-left">Intitulé de l'unité d'enseignement</th>
              <th className="border border-black p-1">Nature de l'UE</th>
              <th className="border border-black p-1">Crédit</th>
              <th className="border border-black p-1">Session</th>
              <th className="border border-black p-1">Rattrapage</th>
              <th className="border border-black p-1">Coefficient</th>
            </tr>
          </thead>
          <tbody>
            {(data.semestre2 || []).map((matiere, index) => (
              <tr key={index}>
                <td className="border border-black p-1">{matiere.matiere}</td>
                <td className="border border-black p-1 text-center">{matiere.nature_ue}</td>
                <td className="border border-black p-1 text-center">{matiere.credit}</td>
                <td className="border border-black p-1 text-center">{matiere.session}</td>
                <td className="border border-black p-1 text-center">{matiere.rattrapage}</td>
                <td className="border border-black p-1 text-center">{matiere.coefficient}</td>
              </tr>
            ))}
            {/* Lignes par défaut si pas de données */}
            {(!data.semestre2 || data.semestre2.length === 0) && (
              <>
                <tr>
                  <td className="border border-black p-1">Programmation orientée système</td>
                  <td className="border border-black p-1 text-center">Fondamentale</td>
                  <td className="border border-black p-1 text-center">8.00</td>
                  <td className="border border-black p-1 text-center">0.00</td>
                  <td className="border border-black p-1 text-center">8.00</td>
                  <td className="border border-black p-1 text-center">3</td>
                </tr>
                <tr>
                  <td className="border border-black p-1">Base de données</td>
                  <td className="border border-black p-1 text-center">Fondamentale</td>
                  <td className="border border-black p-1 text-center">9.00</td>
                  <td className="border border-black p-1 text-center">11.00</td>
                  <td className="border border-black p-1 text-center">10.20</td>
                  <td className="border border-black p-1 text-center">5</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
        <div className="text-right mt-1 font-bold">
          Moyenne générale: <EditableField field="moyenne_generale_s2" value={data.moyenne_generale_s2} className="w-16" />
        </div>
      </div>

      {/* Moyennes finales */}
      <div className="grid grid-cols-3 gap-4 mb-6 bg-gray-100 p-2">
        <div className="text-center">
          <div className="font-bold">Moyenne générale:</div>
          <div><EditableField field="moyenne_generale" value={data.moyenne_generale} className="w-16" /></div>
        </div>
        <div className="text-center">
          <div className="font-bold">Mention:</div>
          <div><EditableField field="mention" value={data.mention} className="w-24" /></div>
        </div>
        <div className="text-center">
          <div className="font-bold">Décision du jury:</div>
          <div><EditableField field="decision" value={data.decision} className="w-24" /></div>
        </div>
      </div>

      {/* Pied de page avec date et signatures */}
      <div className="mt-8">
        <div className="text-right mb-4">
          Fait à: Djibouti, le: <EditableField field="date" value={data.date} className="w-24" />
        </div>
        
        <div className="flex justify-end">
          <div className="text-center">
            <div className="font-bold mb-8">LE DIRECTEUR GÉNÉRAL</div>
            <div className="border-t border-black pt-1">
              <EditableField field="directeur_general" value={data.directeur_general} className="w-32 text-center" />
            </div>
          </div>
        </div>
      </div>

      {/* Note de bas de page */}
      <div className="mt-8 pt-4 border-t border-gray-300">
        <div className="text-xs text-center space-y-1">
          <div>Le présent document est délivré sur demande et validé par l'Administrateur de direction</div>
          <div className="flex justify-between text-xs">
            <div>
              <div>Centre EMD Djibouti/Cité du Stade</div>
              <div>Avenue Georges Clemenceau BP: 2494</div>
              <div>Tél: 21.35.68.78 Email: infos.djibouti@emd-dje</div>
            </div>
            <div className="w-16 h-8 bg-red-200 flex items-center justify-center">
              LOGO
            </div>
            <div>
              <div>École de Management of Engineering and Technology</div>
              <div>Management, IT & Engineering School</div>
              <div>www.emd-dje.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}