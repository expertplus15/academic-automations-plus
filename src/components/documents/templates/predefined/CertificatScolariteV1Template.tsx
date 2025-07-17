import React from 'react';

interface CertificatScolariteV1TemplateProps {
  data: {
    institution_country?: string;
    ministry_name?: string;
    institution_name?: string;
    institution_address?: string;
    student_full_name?: string;
    student_birth_date?: string;
    student_birth_place?: string;
    student_number?: string;
    academic_year?: string;
    class_level?: string;
    program_field?: string;
    program_specialty?: string;
    signatory_function?: string;
    signature_place?: string;
    signature_date?: string;
  };
  isEditable?: boolean;
  onDataChange?: (data: any) => void;
}

export const CertificatScolariteV1Template: React.FC<CertificatScolariteV1TemplateProps> = ({
  data,
  isEditable = false,
  onDataChange
}) => {
  const updateField = (field: string, value: string) => {
    if (isEditable && onDataChange) {
      onDataChange({ ...data, [field]: value });
    }
  };

  const renderField = (value: string | undefined, placeholder: string, field?: string) => {
    if (isEditable && field) {
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => updateField(field, e.target.value)}
          placeholder={placeholder}
          className="border-none bg-transparent outline-none w-full"
          style={{ minWidth: '200px' }}
        />
      );
    }
    return <span>{value || placeholder}</span>;
  };

  return (
    <div className="bg-white p-8 font-serif text-sm leading-relaxed max-w-4xl mx-auto">
      {/* En-tête officiel */}
      <div className="text-center mb-8">
        <div className="text-xs font-bold uppercase tracking-wider mb-2">
          {renderField(data.institution_country, 'RÉPUBLIQUE FRANÇAISE', 'institution_country')}
        </div>
        <div className="text-xs mb-4">
          {renderField(data.ministry_name, 'MINISTÈRE DE L\'ÉDUCATION NATIONALE', 'ministry_name')}
        </div>
        
        <div className="border-2 border-black p-4 mx-auto max-w-md">
          <div className="text-xs font-semibold">
            {renderField(data.institution_name, 'INSTITUT SUPÉRIEUR DE TECHNOLOGIE', 'institution_name')}
          </div>
          <div className="text-xs mt-1">
            {renderField(data.institution_address, 'Avenue de la République, 75000 Paris', 'institution_address')}
          </div>
        </div>
      </div>

      {/* Titre principal */}
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold uppercase tracking-wider border-b-2 border-black inline-block pb-2">
          CERTIFICAT DE SCOLARITÉ
        </h1>
      </div>

      {/* Corps du document */}
      <div className="space-y-6 text-justify">
        <p className="text-base">
          Le Directeur de l'Institut Supérieur de Technologie certifie que :
        </p>

        <div className="bg-gray-50 p-6 border-l-4 border-blue-500">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center">
              <span className="font-semibold min-w-[120px]">Nom et Prénom :</span>
              <span className="uppercase font-bold text-lg">
                {renderField(data.student_full_name, 'DUPONT Jean', 'student_full_name')}
              </span>
            </div>
            
            <div className="flex items-center">
              <span className="font-semibold min-w-[120px]">Né(e) le :</span>
              <span>
                {renderField(data.student_birth_date, '15 mars 1995', 'student_birth_date')}
              </span>
              <span className="ml-4 font-semibold">à :</span>
              <span className="ml-2">
                {renderField(data.student_birth_place, 'Paris (75)', 'student_birth_place')}
              </span>
            </div>
            
            <div className="flex items-center">
              <span className="font-semibold min-w-[120px]">N° d'inscription :</span>
              <span className="font-mono">
                {renderField(data.student_number, 'STU2024001', 'student_number')}
              </span>
            </div>
          </div>
        </div>

        <p className="text-base">
          Est régulièrement inscrit(e) dans notre établissement pour l'année universitaire{' '}
          <span className="font-bold">
            {renderField(data.academic_year, '2024-2025', 'academic_year')}
          </span>{' '}
          en classe de{' '}
          <span className="font-bold">
            {renderField(data.class_level, 'Licence 3', 'class_level')}
          </span>.
        </p>

        <div className="ml-8">
          <div className="flex items-center mb-2">
            <span className="font-semibold min-w-[100px]">Filière :</span>
            <span className="font-bold">
              {renderField(data.program_field, 'Informatique et Sciences du Numérique', 'program_field')}
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold min-w-[100px]">Spécialité :</span>
            <span className="font-bold">
              {renderField(data.program_specialty, 'Développement Logiciel et Systèmes d\'Information', 'program_specialty')}
            </span>
          </div>
        </div>

        <p className="text-base">
          Le présent certificat est délivré pour servir et valoir ce que de droit.
        </p>
      </div>

      {/* Signature */}
      <div className="mt-12 flex justify-end">
        <div className="text-center space-y-3">
          <div className="text-sm">
            {renderField(data.signature_place, 'Paris', 'signature_place')}, le{' '}
            {renderField(data.signature_date, new Date().toLocaleDateString('fr-FR'), 'signature_date')}
          </div>
          <div className="font-semibold text-sm">
            {renderField(data.signatory_function, 'Le Directeur', 'signatory_function')}
          </div>
          <div className="h-16 w-32 border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-500 mx-auto">
            Signature et cachet
          </div>
        </div>
      </div>

      {/* Pied de page */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-xs text-gray-600 text-center">
        <p>Document officiel - Ne pas plastifier</p>
        <p>Pour toute vérification, contacter le secrétariat au 01.23.45.67.89</p>
      </div>
    </div>
  );
};

export default CertificatScolariteV1Template;