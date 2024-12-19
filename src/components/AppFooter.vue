<template>
	<v-footer height="50" app>
		<a
			v-for="item in items"
			:key="item.title"
			:href="item.href"
			:title="item.title"
			class="d-inline-block mx-2 social-link"
			rel="noopener noreferrer"
			target="_blank"
			>
			<v-icon
				:icon="item.icon"
				:size="24"
			/>
		</a>

		<div
			class="text-caption text-disabled"
			style="position: absolute; right: 16px;"
		>
			<span class="d-none d-sm-inline-block mr-1">Vytautas Jaras</span>
			<span class="d-none d-sm-inline-block">T120B165 Saityno taikomųjų programų projektavimas 2024</span>
		</div>
	</v-footer>
</template>

<script setup>
  const items = [
    {
      title: 'GitHub back-end',
      icon: `mdi-github`,
      href: 'https://github.com/vytjar/HotelManagementSystem',
    },
	{
      title: 'GitHub UI',
      icon: `mdi-github`,
      href: 'https://github.com/vytjar/HotelManagementSystem-Client',
    }
  ]
</script>

<style scoped lang="sass">
  .social-link :deep(.v-icon)
    color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity))
    text-decoration: none
    transition: .2s ease-in-out

    &:hover
      color: rgba(25, 118, 210, 1)
</style>
