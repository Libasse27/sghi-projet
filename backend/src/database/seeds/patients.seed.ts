import { DataSource } from 'typeorm';

export class PatientsSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const patientRepository = dataSource.getRepository('Patient');

    // Check if patients already exist
    const existingPatients = await patientRepository.count();
    if (existingPatients > 0) {
      console.log('Patients already exist, skipping seed...');
      return;
    }

    const currentYear = new Date().getFullYear();
    
    const patients = [
      {
        numeroPatient: `P-${currentYear}-0001`,
        nom: 'Diop',
        prenom: 'Amadou',
        dateNaissance: new Date('1985-03-15'),
        sexe: 'M',
        groupeSanguin: 'O+',
        telephone: '+221775551111',
        email: 'amadou.diop@email.com',
        adresse: 'Dakar, Plateau, Rue 10',
        profession: 'Enseignant',
        allergies: 'Aucune allergie connue',
        maladiesChroniques: null,
        antecedentsFamiliaux: 'Diabète (père)',
        antecedentsChirurgicaux: null,
        contactUrgenceNom: 'Aissatou Diop',
        contactUrgenceTelephone: '+221775551112',
        contactUrgenceLien: 'Épouse',
        assuranceNom: 'IPRESS',
        assuranceNumero: 'IPRS-2024-001',
        assuranceExpiration: new Date('2025-12-31'),
        actif: true,
      },
      {
        numeroPatient: `P-${currentYear}-0002`,
        nom: 'Fall',
        prenom: 'Mariama',
        dateNaissance: new Date('1992-07-22'),
        sexe: 'F',
        groupeSanguin: 'A+',
        telephone: '+221775552222',
        email: 'mariama.fall@email.com',
        adresse: 'Dakar, Sacré-Coeur, Villa 45',
        profession: 'Infirmière',
        allergies: 'Pénicilline',
        maladiesChroniques: 'Asthme',
        antecedentsFamiliaux: null,
        antecedentsChirurgicaux: 'Appendicectomie (2010)',
        contactUrgenceNom: 'Moussa Fall',
        contactUrgenceTelephone: '+221775552223',
        contactUrgenceLien: 'Frère',
        assuranceNom: 'IPM',
        assuranceNumero: 'IPM-2024-002',
        assuranceExpiration: new Date('2025-06-30'),
        actif: true,
      },
      {
        numeroPatient: `P-${currentYear}-0003`,
        nom: 'Ndiaye',
        prenom: 'Ibrahima',
        dateNaissance: new Date('1978-11-05'),
        sexe: 'M',
        groupeSanguin: 'B+',
        telephone: '+221775553333',
        email: null,
        adresse: 'Pikine, Quartier Tally Bou Bess',
        profession: 'Commerçant',
        allergies: null,
        maladiesChroniques: 'Hypertension',
        antecedentsFamiliaux: 'Hypertension (mère)',
        antecedentsChirurgicaux: null,
        contactUrgenceNom: 'Khady Ndiaye',
        contactUrgenceTelephone: '+221775553334',
        contactUrgenceLien: 'Épouse',
        assuranceNom: null,
        assuranceNumero: null,
        assuranceExpiration: null,
        actif: true,
      },
      {
        numeroPatient: `P-${currentYear}-0004`,
        nom: 'Sy',
        prenom: 'Fatou',
        dateNaissance: new Date('2000-01-18'),
        sexe: 'F',
        groupeSanguin: 'AB+',
        telephone: '+221775554444',
        email: 'fatou.sy@email.com',
        adresse: 'Dakar, Mermoz, Immeuble 12',
        profession: 'Étudiante',
        allergies: 'Fruits de mer',
        maladiesChroniques: null,
        antecedentsFamiliaux: null,
        antecedentsChirurgicaux: null,
        contactUrgenceNom: 'Aminata Sy',
        contactUrgenceTelephone: '+221775554445',
        contactUrgenceLien: 'Mère',
        assuranceNom: 'IPRESS',
        assuranceNumero: 'IPRS-2024-004',
        assuranceExpiration: new Date('2025-08-31'),
        actif: true,
      },
      {
        numeroPatient: `P-${currentYear}-0005`,
        nom: 'Sow',
        prenom: 'Ousmane',
        dateNaissance: new Date('1955-09-12'),
        sexe: 'M',
        groupeSanguin: 'O-',
        telephone: '+221775555555',
        email: null,
        adresse: 'Dakar, Grand Yoff',
        profession: 'Retraité',
        allergies: null,
        maladiesChroniques: 'Diabète Type 2, Hypertension',
        antecedentsFamiliaux: 'Diabète (père et mère)',
        antecedentsChirurgicaux: 'Pontage coronarien (2018)',
        contactUrgenceNom: 'Mamadou Sow',
        contactUrgenceTelephone: '+221775555556',
        contactUrgenceLien: 'Fils',
        assuranceNom: 'IPM',
        assuranceNumero: 'IPM-2024-005',
        assuranceExpiration: new Date('2025-12-31'),
        actif: true,
      },
    ];

    await patientRepository.save(patients);
    console.log(`✓ ${patients.length} patients seeded successfully`);
  }
}
