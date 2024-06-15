<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';

type Website = {
	_id: string;
	name: string;
	url: string;
};

const websitesLoading = ref(true);
const websites = ref<Website[]>([]);

async function fetchWebsites() {
	websitesLoading.value = true;
	try {
		const result = await axios.get<Website[]>('https://wahoo-backend.vercel.app/website/read_all');

		if (result.data) {
			websites.value = result.data;
		}
	} catch (error) {
		console.error(error);
	} finally {
		websitesLoading.value = false;
	}
}

onMounted(() => {
	fetchWebsites();
});

const websiteAdding = ref(false);
const enteredName = ref('');
const enteredUrl = ref('');

async function addWebsite() {
	websiteAdding.value = true;
	try {
		await axios.post('https://wahoo-backend.vercel.app/website/create', {
			name: enteredName.value,
			url: enteredUrl.value,
		});
		fetchWebsites();
	} catch (error) {
		console.error(error);
	} finally {
		websiteAdding.value = false;
	}
}

async function deleteWebsite(id: string) {
	try {
		await axios.delete(`https://wahoo-backend.vercel.app/website/delete/${id}`);
		const index = websites.value.findIndex(website => website._id === id);
		websites.value.splice(index, 1);
	} catch (error) {
		console.error(error);
	}
}

async function editWebsite(id: string, newWebsite: Website) {
	try {
		await axios.put(`https://wahoo-backend.vercel.app/website/update/${id}`, newWebsite);
	} catch (error) {
		console.error(error);
	}
}
</script>

<template>
	<div class="w-full h-screen bg-gray-100 p-8">
		<div class="max-w-sm mx-auto flex flex-col h-full overflow-hidden">
			<h2 class="text-2xl font-bold mb-4 mx-auto">افزودن وب سایت</h2>
			<form
				@submit.prevent="addWebsite"
				class="flex flex-col gap-4 border-2 border-blue-500 p-6 rounded-2xl mb-10"
			>
				<div class="flex flex-col gap-2">
					<label for="name">نام وب سایت</label>
					<input
						required
						v-model="enteredName"
						id="name"
						type="text"
						class="px-4 py-2 rounded-md placeholder:text-right"
						placeholder="نام وب سایت مورد نظر را وارد کنید"
						dir="auto"
					/>
				</div>
				<div class="flex flex-col gap-2">
					<label for="url">آدرس وب سایت</label>
					<input
						required
						dir="ltr"
						v-model="enteredUrl"
						name="url"
						type="url"
						class="px-4 py-2 rounded-md placeholder:text-right"
						placeholder="آدرس وب سایت مورد نظر را وارد کنید"
					/>
				</div>
				<button
					:disabled="websiteAdding"
					type="submit"
					class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
				>
					{{ websiteAdding ? 'درحال افزودن...' : 'افزودن' }}
				</button>
			</form>

			<h2 class="text-2xl font-bold mb-4 mx-auto">لیست وب سایت ها</h2>
			<span v-if="websitesLoading" class="text-center">درحال بارگذاری...</span>
			<ul v-else-if="websites.length" class="flex flex-col gap-2 flex-1 overflow-y-auto">
				<li
					v-for="website in websites"
					:key="website._id"
					class="flex justify-between items-center border-2 border-blue-500 p-3 rounded-xl"
				>
					<span
						class="capitalize px-2 py-1"
						contenteditable="plaintext-only"
						@input="
							event => editWebsite(website._id, { ...website, name: event.target?.innerText })
						"
						>{{ website.name }}</span
					>
					<div class="flex gap-2 items-center">
						<button
							class="hover:bg-red-100 text-red-500 rounded-md px-2 py-1"
							@click="deleteWebsite(website._id)"
						>
							حذف
						</button>
						<a :href="website.url" class="text-blue-500 py-1 px-2 hover:bg-blue-100 rounded-md"
							>بازدید</a
						>
					</div>
				</li>
			</ul>
			<span v-else class="text-red-500 text-center">هیچ وب سایتی یافت نشد</span>
		</div>
	</div>
</template>
