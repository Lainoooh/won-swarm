<template>
  <div class="settings-page">
    <h2>系统设置</h2>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>系统信息</span>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="系统名称">WonSwarm</el-descriptions-item>
            <el-descriptions-item label="版本">v0.1.0</el-descriptions-item>
            <el-descriptions-item label="后端地址">http://localhost:30009</el-descriptions-item>
            <el-descriptions-item label="前端地址">http://localhost:3000</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <span>网络配置</span>
          </template>
          <el-form label-width="100px">
            <el-form-item label="服务端口">
              <el-input value="30009" disabled />
            </el-form-item>
            <el-form-item label="外网地址">
              <el-input placeholder="配置外网访问地址" />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
// 系统设置页面
</script>

<style scoped>
.settings-page {
  padding: 20px;
}

.settings-page h2 {
  margin-bottom: 20px;
  color: #333;
}
</style>
