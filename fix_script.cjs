const fs = require('fs');
const file = 'd:/office-project/execora-frontend-uat/execora-frontend-uat/src/pages/inbox/InboxPage.vue';
let c = fs.readFileSync(file, 'utf8');

// Fix TypeScript error in filteredGroups
c = c.replace(/const grouped: Record<string, typeof allItems\.value> = \{\}/g, 'const grouped: Record<string, any[]> = {}');
c = c.replace(/; \(grouped\[item\.group\] as typeof allItems\.value\)\.push\(item\)/g, '; (grouped[item.group] as any[]).push(item)');

// Lift allItems, bookmarks, archived to the top
const allItemsStr = c.substring(c.indexOf('const allItems = ref(['), c.indexOf('const filteredGroups = computed('));
c = c.replace(allItemsStr, '');

const scriptSetup = '<script setup lang="ts">\nimport { ref, computed } from \'vue\'\n\n' + allItemsStr + '\n';
c = c.replace(/<script setup lang="ts">\nimport \{ ref, computed \} from 'vue'/, scriptSetup);

fs.writeFileSync(file, c, 'utf8');
console.log('Fixed script setup hoisting and TS errors.');
