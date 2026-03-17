<template>
  <div ref="editorContainer"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { Mention, MentionBlot } from 'quill-mention'
import 'quill-mention/dist/quill.mention.css'

if (Mention) {
  Quill.register('modules/mention', Mention)
}
if (MentionBlot) {
  Quill.register(MentionBlot)
}

const props = defineProps<{
  content?: string
  theme?: string
  placeholder?: string
  readOnly?: boolean
  modules?: any
}>()

const emit = defineEmits(['update:content'])

const editorContainer = ref<HTMLElement | null>(null)
let quill: Quill | null = null

onMounted(() => {
  if (editorContainer.value) {
    quill = new Quill(editorContainer.value, {
      theme: props.theme || 'snow',
      placeholder: props.placeholder,
      readOnly: props.readOnly,
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['image', 'code-block']
        ],
        mention: props.modules?.mention,
        ...props.modules
      }
    })

    if (props.content) {
      quill.root.innerHTML = props.content
    }

    quill.on('text-change', () => {
      emit('update:content', quill?.root.innerHTML)
    })
  }
})

watch(() => props.content, (newContent) => {
  if (quill && newContent !== quill.root.innerHTML) {
    quill.root.innerHTML = newContent || ''
  }
})
</script>

<style>
/* Add any custom overrides here */
.ql-editor {
  min-height: 200px;
}
</style>
