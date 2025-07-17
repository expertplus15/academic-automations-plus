import React from 'react';

export interface CertificatData {
  // En-tête établissement
  republique: string;
  ministere: string;
  ecole: string;
  
  // Informations document
  numero_certificat: string;
  type_certificat: string;
  titre_formation: string;
  
  // Informations étudiant
  nom: string;
  prenom: string;
  date_naissance: string;
  lieu_naissance: string;
  nationalite: string;
  matricule: string;
  
  // Détails de la formation
  programme: string;
  specialisation: string;
  niveau: string;
  duree_formation: string;
  date_debut: string;
  date_fin: string;
  
  // Résultats
  moyenne_generale: number;
  mention: string;
  total_credits: number;
  rang_promotion: string;
  taille_promotion: number;
  
  // Validation et délivrance
  date_deliberation: string;
  date_emission: string;
  lieu_emission: string;
  president_jury: string;
  directeur_general: string;
  numero_registre: string;
}

interface CertificatTemplateProps {
  data: Partial<CertificatData>;
  isEditable?: boolean;
  onDataChange?: (data: Partial<CertificatData>) => void;
}

export function CertificatTemplate({ data, isEditable = false, onDataChange }: CertificatTemplateProps) {
  const handleChange = (field: keyof CertificatData, value: any) => {
    if (onDataChange) {
      onDataChange({ ...data, [field]: value });
    }
  };

  const EditableField = ({ field, value, className = "", type = "text" }: { 
    field: keyof CertificatData; 
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

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border-8 border-double border-amber-600" style={{ fontFamily: 'Times New Roman, serif' }}>
      {/* Bordure décorative externe */}
      <div className="border-4 border-amber-400 m-2 p-8">
        {/* Bordure décorative interne */}
        <div className="border-2 border-amber-300 p-6">
          
          {/* En-tête officiel */}
          <div className="text-center mb-8 space-y-2">
            <div className="flex items-center justify-center space-x-8">
              <div className="w-16 h-16 bg-amber-100 border-2 border-amber-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-amber-800">ARMOIRIES</span>
              </div>
              <div className="space-y-1">
                <div className="font-bold text-lg text-amber-800">
                  <EditableField field="republique" value={data.republique} />
                </div>
                <div className="font-semibold text-sm">
                  <EditableField field="ministere" value={data.ministere} />
                </div>
                <div className="text-sm font-medium">
                  <EditableField field="ecole" value={data.ecole} />
                </div>
              </div>
              <div className="w-16 h-16 bg-amber-100 border-2 border-amber-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-amber-800">LOGO</span>
              </div>
            </div>
          </div>

          {/* Titre principal du certificat */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-amber-800 mb-2" style={{ fontFamily: 'Times New Roman, serif' }}>
                <EditableField field="type_certificat" value={data.type_certificat} />
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto"></div>
            </div>
            
            <div className="text-lg font-semibold text-gray-700">
              EN <EditableField field="titre_formation" value={data.titre_formation} className="font-bold text-amber-800" />
            </div>
          </div>

          {/* Numéro et registre */}
          <div className="flex justify-between mb-8 text-sm">
            <div>
              <span className="font-semibold">Certificat N° :</span>
              <EditableField field="numero_certificat" value={data.numero_certificat} className="font-bold ml-1" />
            </div>
            <div>
              <span className="font-semibold">Registre N° :</span>
              <EditableField field="numero_registre" value={data.numero_registre} className="font-bold ml-1" />
            </div>
          </div>

          {/* Corps principal du certificat */}
          <div className="space-y-6 text-justify leading-relaxed text-base">
            <p className="text-center text-lg font-medium">
              Le Président du Jury d'Examen et le Directeur Général certifient que
            </p>

            {/* Informations de l'étudiant dans un cadre décoré */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-lg p-6 shadow-lg">
              <div className="text-center space-y-3">
                <div className="text-xl font-bold text-amber-800">
                  <EditableField field="prenom" value={data.prenom} className="mr-2" />
                  <EditableField field="nom" value={data.nom} />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Né(e) le :</span>
                    <EditableField field="date_naissance" value={data.date_naissance} className="ml-1" />
                  </div>
                  <div>
                    <span className="font-semibold">À :</span>
                    <EditableField field="lieu_naissance" value={data.lieu_naissance} className="ml-1" />
                  </div>
                  <div>
                    <span className="font-semibold">Nationalité :</span>
                    <EditableField field="nationalite" value={data.nationalite} className="ml-1" />
                  </div>
                  <div>
                    <span className="font-semibold">Matricule :</span>
                    <EditableField field="matricule" value={data.matricule} className="ml-1 font-mono" />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-lg">
              A suivi avec succès et dans sa totalité le programme d'études de 
              <strong className="text-amber-800 mx-1">
                <EditableField field="programme" value={data.programme} />
              </strong>
              {data.specialisation && (
                <>
                  , spécialisation 
                  <strong className="text-amber-800 mx-1">
                    <EditableField field="specialisation" value={data.specialisation} />
                  </strong>
                </>
              )}
            </p>

            {/* Détails de la formation */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Niveau :</span>
                  <EditableField field="niveau" value={data.niveau} className="ml-1" />
                </div>
                <div>
                  <span className="font-semibold">Durée de formation :</span>
                  <EditableField field="duree_formation" value={data.duree_formation} className="ml-1" />
                </div>
                <div>
                  <span className="font-semibold">Date de début :</span>
                  <EditableField field="date_debut" value={data.date_debut} className="ml-1" />
                </div>
                <div>
                  <span className="font-semibold">Date de fin :</span>
                  <EditableField field="date_fin" value={data.date_fin} className="ml-1" />
                </div>
              </div>
            </div>

            {/* Résultats */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-bold text-green-800 mb-3 text-center">RÉSULTATS OBTENUS</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold">Moyenne Générale</div>
                  <div className="text-2xl font-bold text-green-800">
                    <EditableField field="moyenne_generale" value={data.moyenne_generale} type="number" className="w-16 text-center" />/20
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">Mention</div>
                  <div className="text-lg font-bold text-green-800">
                    <EditableField field="mention" value={data.mention} />
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">Crédits ECTS</div>
                  <div className="text-lg font-bold">
                    <EditableField field="total_credits" value={data.total_credits} type="number" className="w-12" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">Rang dans la promotion</div>
                  <div className="text-lg font-bold">
                    <EditableField field="rang_promotion" value={data.rang_promotion} className="w-8" />
                    {data.taille_promotion && (
                      <>
                        /<EditableField field="taille_promotion" value={data.taille_promotion} type="number" className="w-8" />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-lg">
              À la suite de délibérations tenues le 
              <strong className="mx-1">
                <EditableField field="date_deliberation" value={data.date_deliberation} />
              </strong>
            </p>

            <p className="text-center text-lg font-semibold text-amber-800">
              EN FOI DE QUOI, LE PRÉSENT CERTIFICAT LUI EST DÉLIVRÉ 
              <br />
              POUR SERVIR ET VALOIR CE QUE DE DROIT
            </p>
          </div>

          {/* Signatures */}
          <div className="mt-12 grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="mb-8">
                Fait à <EditableField field="lieu_emission" value={data.lieu_emission} />, 
                le <EditableField field="date_emission" value={data.date_emission} />
              </div>
              
              <div className="space-y-4">
                <div className="font-bold text-lg">LE PRÉSIDENT DU JURY</div>
                <div className="h-16 border-b-2 border-amber-300"></div>
                <div>
                  <EditableField field="president_jury" value={data.president_jury} className="font-semibold" />
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="mb-8">
                <strong>VISA DE L'ADMINISTRATION</strong>
              </div>
              
              <div className="space-y-4">
                <div className="font-bold text-lg">LE DIRECTEUR GÉNÉRAL</div>
                <div className="h-16 border-b-2 border-amber-300"></div>
                <div>
                  <EditableField field="directeur_general" value={data.directeur_general} className="font-semibold" />
                </div>
              </div>
            </div>
          </div>

          {/* Cachet et sceaux */}
          <div className="mt-8 flex justify-center space-x-16">
            <div className="w-20 h-20 border-2 border-amber-400 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-amber-800 text-center">CACHET<br />JURY</span>
            </div>
            <div className="w-20 h-20 border-2 border-amber-400 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-amber-800 text-center">SCEAU<br />OFFICIEL</span>
            </div>
          </div>

          {/* QR Code de vérification */}
          <div className="mt-6 text-center">
            <div className="inline-block">
              <div className="w-16 h-16 bg-gray-200 border border-gray-400 flex items-center justify-center mx-auto mb-2">
                <span className="text-xs font-bold">QR</span>
              </div>
              <div className="text-xs text-gray-600">Code de vérification</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}