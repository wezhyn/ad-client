<template>
  <activity-detail :is-edit="false" />
</template>

<script>
import ActivityDetail from './components/ActivityDetail'

export default {
  name: 'NewsCreate',
  components: { ActivityDetail }
}
</script>

