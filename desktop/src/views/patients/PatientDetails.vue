<template>
  <div class="patient-details" v-if="patient">
    <a-page-header
      :title="`${patient.nom} ${patient.prenom}`"
      :sub-title="`ID: ${patient.id}`"
      @back="() => $router.back()"
    >
      <template #extra>
        <a-space>
          <a-button @click="$router.push(`/patients/${patient.id}/edit`)">
            <template #icon><edit-outlined /></template>
            Modifier
          </a-button>
          <a-dropdown>
            <template #overlay>
              <a-menu>
                <a-menu-item key="consultation" @click="newConsultation">
                  <file-text-outlined /> Nouvelle Consultation
                </a-menu-item>
                <a-menu-item key="lab" @click="newLabRequest">
                  <experiment-outlined /> Demande d'Analyse
                </a-menu-item>
                <a-menu-item key="print">
                  <printer-outlined /> Imprimer Fiche
                </a-menu-item>
              </a-menu>
            </template>
            <a-button>
              Actions <down-outlined />
            </a-button>
          </a-dropdown>
        </a-space>
      </template>

      <a-descriptions size="small" :column="3">
        <a-descriptions-item label="Âge">{{ patient.age }} ans</a-descriptions-item>
        <a-descriptions-item label="Sexe">{{ patient.sexe === 'M' ? 'Masculin' : 'Féminin' }}</a-descriptions-item>
        <a-descriptions-item label="Groupe Sanguin">
          <a-tag color="red">{{ patient.groupeSanguin }}</a-tag>
        </a-descriptions-item>
      </a-descriptions>
    </a-page-header>

    <div class="details-content">
      <a-row :gutter="16">
        <!-- Informations Personnelles -->
        <a-col :span="16">
          <a-tabs v-model:activeKey="activeTab">
            <a-tab-pane key="info" tab="Informations">
              <a-card title="Informations Personnelles">
                <a-descriptions bordered :column="2">
                  <a-descriptions-item label="Nom">{{ patient.nom }}</a-descriptions-item>
                  <a-descriptions-item label="Prénom">{{ patient.prenom }}</a-descriptions-item>
                  <a-descriptions-item label="Date de Naissance">
                    {{ formatDate(patient.dateNaissance) }}
                  </a-descriptions-item>
                  <a-descriptions-item label="Âge">{{ patient.age }} ans</a-descriptions-item>
                  <a-descriptions-item label="Sexe">{{ patient.sexe === 'M' ? 'Masculin' : 'Féminin' }}</a-descriptions-item>
                  <a-descriptions-item label="Groupe Sanguin">
                    <a-tag color="red">{{ patient.groupeSanguin }}</a-tag>
                  </a-descriptions-item>
                  <a-descriptions-item label="Téléphone">{{ patient.telephone }}</a-descriptions-item>
                  <a-descriptions-item label="Email">{{ patient.email || 'Non renseigné' }}</a-descriptions-item>
                  <a-descriptions-item label="Adresse" :span="2">{{ patient.adresse }}</a-descriptions-item>
                </a-descriptions>
              </a-card>

              <a-card title="Antécédents Médicaux" class="mt-3">
                <a-descriptions bordered>
                  <a-descriptions-item label="Allergies" :span="3">
                    {{ patient.allergies || 'Aucune allergie connue' }}
                  </a-descriptions-item>
                  <a-descriptions-item label="Maladies Chroniques" :span="3">
                    {{ patient.maladiesChroniques || 'Aucune' }}
                  </a-descriptions-item>
                </a-descriptions>
              </a-card>
            </a-tab-pane>

            <a-tab-pane key="consultations" tab="Consultations">
              <a-card>
                <a-timeline>
                  <a-timeline-item v-for="consultation in mockConsultations" :key="consultation.id">
                    <template #dot>
                      <file-text-outlined style="font-size: 16px" />
                    </template>
                    <p>{{ formatDate(consultation.date) }}</p>
                    <p><strong>Motif:</strong> {{ consultation.motif }}</p>
                    <p><strong>Médecin:</strong> {{ consultation.medecin }}</p>
                  </a-timeline-item>
                </a-timeline>
              </a-card>
            </a-tab-pane>

            <a-tab-pane key="analyses" tab="Analyses">
              <a-card>
                <a-list
                  :data-source="mockAnalyses"
                  item-layout="horizontal"
                >
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <a-list-item-meta :description="formatDate(item.date)">
                        <template #title>{{ item.type }}</template>
                      </a-list-item-meta>
                      <template #actions>
                        <a-tag :color="getStatusColor(item.status)">{{ item.status }}</a-tag>
                      </template>
                    </a-list-item>
                  </template>
                </a-list>
              </a-card>
            </a-tab-pane>
          </a-tabs>
        </a-col>

        <!-- Carte Résumé -->
        <a-col :span="8">
          <a-card title="Résumé">
            <a-statistic title="Consultations" :value="12" class="mb-3" />
            <a-statistic title="Analyses" :value="8" class="mb-3" />
            <a-statistic title="Dernière Visite" :value="formatDate(new Date())" />
          </a-card>

          <a-card title="Contact d'Urgence" class="mt-3">
            <p><strong>Nom:</strong> {{ patient.contactUrgence?.nom || 'Non renseigné' }}</p>
            <p><strong>Téléphone:</strong> {{ patient.contactUrgence?.telephone || 'Non renseigné' }}</p>
            <p><strong>Lien:</strong> {{ patient.contactUrgence?.lien || 'Non renseigné' }}</p>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  EditOutlined,
  DownOutlined,
  FileTextOutlined,
  ExperimentOutlined,
  PrinterOutlined,
} from '@ant-design/icons-vue';
import dayjs from 'dayjs';

const router = useRouter();
const route = useRoute();
const activeTab = ref('info');

const patient = ref({
  id: route.params.id,
  nom: 'Diallo',
  prenom: 'Amadou',
  dateNaissance: new Date('1979-05-15'),
  age: 45,
  sexe: 'M',
  telephone: '+223 70 12 34 56',
  email: 'amadou.diallo@email.com',
  adresse: 'Bamako, Badalabougou, Rue 125',
  groupeSanguin: 'A+',
  allergies: 'Pénicilline',
  maladiesChroniques: 'Hypertension',
  contactUrgence: {
    nom: 'Diallo Fatoumata',
    telephone: '+223 76 54 32 10',
    lien: 'Épouse',
  },
});

const mockConsultations = ref([
  { id: 1, date: new Date(), motif: 'Contrôle de routine', medecin: 'Dr. Koné' },
  { id: 2, date: new Date(Date.now() - 2592000000), motif: 'Céphalées', medecin: 'Dr. Sanogo' },
]);

const mockAnalyses = ref([
  { id: 1, type: 'Hémogramme', date: new Date(), status: 'Validée' },
  { id: 2, type: 'Glycémie', date: new Date(Date.now() - 1296000000), status: 'Validée' },
]);

const formatDate = (date) => {
  return dayjs(date).format('DD/MM/YYYY');
};

const getStatusColor = (status) => {
  return status === 'Validée' ? 'success' : 'processing';
};

const newConsultation = () => {
  router.push(`/consultations/create?patientId=${patient.value.id}`);
};

const newLabRequest = () => {
  router.push(`/laboratory/create?patientId=${patient.value.id}`);
};
</script>

<style scoped lang="scss">
.patient-details {
  .details-content {
    padding: 24px;
  }

  .mt-3 {
    margin-top: 16px;
  }

  .mb-3 {
    margin-bottom: 16px;
  }
}
</style>
