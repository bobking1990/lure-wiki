<template>
  <div class="wiki-container">
    <!-- 头部导航 -->
    <header class="wiki-header">
      <div class="logo">🎣 自由路亚百科 (Lure Wiki)</div>
      <p class="subtitle">全面、专业的路亚拟饵与钓法新手指南</p>
    </header>

    <!-- 主体内容 -->
    <main class="wiki-main">
      <!-- 拟饵知识卡片区 -->
      <section class="lure-grid">
        <div v-for="lure in lures" :key="lure.id" class="lure-card">
          <div class="card-icon">{{ lure.icon }}</div>
          <h2>{{ lure.name }}</h2>
          <span class="badge">{{ lure.layer }}</span>
          <p>{{ lure.desc }}</p>
          <div class="target-fish">🎯 目标鱼种: {{ lure.target }}</div>
        </div>
      </section>

      <!-- 全栈互动区：边缘评论板 -->
      <section class="comment-section">
        <h3>💬 钓友交流区 (基于 Cloudflare Functions)</h3>
        
        <!-- 评论列表 -->
        <div class="comment-list">
          <div v-if="comments.length === 0" class="no-comment">暂无评论，快来抢沙发！</div>
          <div v-for="(item, idx) in comments" :key="idx" class="comment-item">
            <div class="comment-meta">
              <span class="user">匿名钓友</span>
              <span class="time">{{ new Date(item.timestamp).toLocaleString() }}</span>
            </div>
            <p class="content">{{ item.text }}</p>
          </div>
        </div>

        <!-- 发表评论表单 -->
        <form @submit.prevent="submitComment" class="comment-form">
          <input 
            v-model="newComment" 
            type="text" 
            placeholder="分享你的钓获或路亚心得..." 
            required 
          />
          <button type="submit" :disabled="submitting">
            {{ submitting ? '发送中...' : '提交评论' }}
          </button>
        </form>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 1. 静态路亚百科数据
const lures = ref([
  { id: 1, icon: '🐟', name: '米诺 (Minnow)', layer: '水面至中下层', desc: '最经典的拟饵，模仿受伤小鱼的泳姿，通过抽停动作诱鱼。', target: '翘嘴、鲈鱼、鳜鱼' },
  { id: 2, icon: '✏️', name: '波趴 (Popper)', layer: '水面系 (Topwater)', desc: '头部有凹槽，抽动时会在水面撞击出水花和砰砰声，激起掠食鱼攻击。', target: '鳡鱼、翘嘴、黑鱼' },
  { id: 3, icon: '🪱', name: '软虫 + 德州钓组', layer: '全泳层/底层', desc: '配合子弹铅和曲柄钩，能高效搜索水底障碍区，感知极其细腻。', target: '大口黑鲈、鳜鱼、黑鱼' },
  { id: 4, icon: '🥄', name: '亮片 (Spoon)', layer: '全泳层搜索', desc: '依靠金属片反光和高频颤动吸引鱼群，远投性能极佳，适合大水面搜索。', target: '马口、白条、红尾、翘嘴' }
])

// 2. 动态评论业务逻辑
interface Comment {
  text: string
  timestamp: string
}

const comments = ref<Comment[]>([])
const newComment = ref('')
const submitting = ref(false)

// 获取评论
const fetchComments = async () => {
  try {
    const res = await fetch('/api/comments')
    if (res.ok) {
      comments.value = await res.json()
    }
  } catch (err) {
    console.error('加载评论失败', err)
  }
}

// 提交评论
const submitComment = async () => {
  if (!newComment.value.trim()) return
  submitting.value = true
  try {
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ text: newComment.value })
    })
    if (res.ok) {
      newComment.value = ''
      await fetchComments() // 刷新列表
    }
  } catch (err) {
    alert('提交失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchComments()
})
</script>

<style scoped>
/* 极简精致的现代化 UI 样式 */
.wiki-container { max-width: 1000px; margin: 0 auto; padding: 2rem 1rem; font-family: system-ui, sans-serif; color: #2c3e50; }
.wiki-header { text-align: center; margin-bottom: 3rem; }
.wiki-header h1 { font-size: 2.5rem; color: #1a73e8; margin-bottom: 0.5rem; }
.subtitle { color: #5f6368; font-size: 1.1rem; }

.lure-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 4rem; }
.lure-card { background: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; padding: 1.5rem; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
.lure-card:hover { transform: translateY(-4px); box-shadow: 0 8px 16px rgba(0,0,0,0.06); }
.card-icon { font-size: 2.5rem; margin-bottom: 1rem; }
.lure-card h2 { font-size: 1.3rem; margin: 0 0 0.5rem 0; }
.badge { display: inline-block; background: #e8f0fe; color: #1a73e8; padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.85rem; font-weight: bold; margin-bottom: 1rem; }
.target-fish { margin-top: 1rem; font-size: 0.9rem; color: #137333; font-weight: 500; }

.comment-section { background: #f8f9fa; border-radius: 16px; padding: 2rem; border: 1px solid #f1f3f4; }
.comment-list { margin: 1.5rem 0; max-height: 300px; overflow-y: auto; }
.comment-item { background: #fff; padding: 1rem; border-radius: 8px; margin-bottom: 0.75rem; border: 1px solid #e8eaed; }
.comment-meta { display: flex; justify-content: space-between; font-size: 0.85rem; color: #80868b; margin-bottom: 0.5rem; }
.user { font-weight: bold; color: #3c4043; }
.comment-form { display: flex; gap: 0.5rem; }
.comment-form input { flex: 1; padding: 0.75rem 1rem; border: 1px solid #dadce0; border-radius: 8px; font-size: 1rem; }
.comment-form button { background: #1a73e8; color: #fff; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-size: 1rem; cursor: pointer; font-weight: bold; }
.comment-form button:disabled { background: #9aa0a6; }
.no-comment { text-align: center; color: #9aa0a6; padding: 2rem 0; }
</style>