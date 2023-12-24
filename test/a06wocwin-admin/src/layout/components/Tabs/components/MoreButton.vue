<template>
  <el-dropdown trigger="click" :teleported="false">
    <!-- <el-tooltip effect="dark" :content="$t('tabs.more')" placement="bottom"> -->
    <el-icon><ArrowDown /></el-icon>
    <!-- </el-tooltip> -->
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="closeCurrentTab">
          <el-icon><Remove /></el-icon>{{ $t("tabs.closeCurrent") }}
        </el-dropdown-item>
        <el-dropdown-item @click="closeOtherTab">
          <el-icon><CircleClose /></el-icon>{{ $t("tabs.closeOther") }}
        </el-dropdown-item>
        <el-dropdown-item @click="closeAllTab">
          <el-icon><FolderDelete /></el-icon>{{ $t("tabs.closeAll") }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { HOME_URL } from "@/config";
import { useTabsStore } from "@/store/modules/tabs";
import { useKeepAliveStore } from "@/store/modules/keepAlive";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const tabStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();

// Close Current
const closeCurrentTab = () => {
  if (route.meta.isAffix) return;
  tabStore.removeTabs(route.fullPath);
  keepAliveStore.removeKeepAliveName(route.name as string);
};

// Close Other
const closeOtherTab = () => {
  tabStore.closeMultipleTab(route.fullPath);
  keepAliveStore.setKeepAliveName([route.name] as string[]);
};

// Close All
const closeAllTab = () => {
  tabStore.closeMultipleTab();
  keepAliveStore.setKeepAliveName();
  router.push(HOME_URL);
};
</script>
