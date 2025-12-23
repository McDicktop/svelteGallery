<script>
	import "./layout.css";
	import { page } from "$app/stores";
	import { onMount } from "svelte";

	const tabs = [
		{ name: "Gallery", path: "/" },
		{ name: "Admin", path: "/admin" },
	];
</script>

<div class="flex h-screen">
	<aside class="w-[250px] overflow-y-auto bg-neutral-300 p-4">
		<nav class="flex flex-col gap-2">
			{#each tabs as tab (tab.path)}
				<a
					href={tab.path}
					class="px-4 py-1 rounded-xl font-semibold bg-neutral-300 hover:bg-neutral-400 duration-200"
				>
					{tab.name}
				</a>
			{/each}
		</nav>
	</aside>

	<main class="flex-1 overflow-y-auto">
		<slot />
	</main>
</div>
