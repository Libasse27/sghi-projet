<template>
  <div class="not-found-view">
    <a-result status="404" title="404" sub-title="Désolé, la page que vous recherchez n'existe pas.">
      <template #extra>
        <a-button type="primary" @click="$router.push('/')">
          Retour à l'accueil
        </a-button>
      </template>
    </a-result>
  </div>
</template>

<script setup>
</script>

<style scoped lang="scss">
.not-found-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
}
</style>
