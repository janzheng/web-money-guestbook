
<script>
	import { goto, stores } from '@sapper/app';
  import { onMount } from 'svelte';
	let userData, userId, isLoading, error


  onMount(async () => {

	  try {
	  	isLoading = true
			fetch(`api/profile`).then(async (resp) => { 

				const data = await resp.json()

				if(resp.status !== 200)
					goto('/login');

				console.log('results:', data)
				userId = data.id['@ref'].id
				userData = data.user.data
	  		isLoading = false
			}).catch((err) => {
		  	isLoading = false
	  		// error = err
	    	// console.log('no access!', err)
				goto('/login');
			})

	  } catch (err) {
	  }
	})

</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<h1>Profile page</h1>

{#if isLoading}
	<p>... loading user data</p>
{/if}


{#if userData}
	your user id: { userId } | your email: { userData.email }
{/if}


