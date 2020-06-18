

<script context="module">
  export async function preload(page, session) {
    const messages = await this.fetch(`api/messages`).then(r => r.json())
    return { messages }
  }
</script>



<script>
	import { goto, stores } from '@sapper/app';
  import { onMount } from 'svelte';

  import MessageComponent from '../components/Messages.svelte'
	let userId, userData, isLoading, error, pointer
  let monetizationStartEventOccurred = false, monetizationEvent

	export let messages
	// $: console.log('loaded messages :?:', messages)


	const refreshPointer = async () => {
		try{
    	$: pointer = await fetch(`api/money`).then(r => r.json())
    	console.log('ptr ptr ptr', pointer)
		} catch(e) {
			console.error('???', e)
		}
	} 

	if(process.browser) {
		setInterval(() => { 
			refreshPointer()
		}, 1000)
	}

	$: if(monetizationEvent && process.browser) {
		console.log('monetization:', monetizationEvent, document.monetization.state)
	}

  onMount(async () => {

  	// console.log('monetization:::???', document.monetization)
	  if (!document.monetization){
	    document.getElementById('error-no-monetization').style.display = 'block';
	  }

	  // from: https://testwebmonetization.com/
	  // check if monetization is implemented
	  if (document.monetization){
	    //monetization start event.
	    document.monetization.addEventListener('monetizationstart', function(event){
	      monetizationStartEventOccurred = true
	      monetizationEvent = event
	      console.log('monetizationstarted', event, document.monetization)
	    });

	    //monetization progress event.
	    document.monetization.addEventListener('monetizationprogress', function(event){
	      monetizationEvent = event
	    });
	  }

	})


</script>

<svelte:head>
	<title>Web Monetization Messages Example</title>
	<meta name="monetization" content={pointer} >
</svelte:head>



<h1>Web Monetized Guest Book</h1>

{#if pointer}
	<p>Currently paying: <strong>{ pointer }</strong></p>
{/if}

<p>This example uses the <a href="https://coil.com/p/sharafian/Probabilistic-Revenue-Sharing/8aQDSPsw ">Probailistic Revenue Sharing</a> example to pay anyone who enters messages in the guest book. The more messages you write, the higher your chances are of getting paid!</p>
<p>To get a quick and easy payment pointer for free, go to <a href="https://uphold.com">Uphold</a>
<MessageComponent {messages} />

<h2>About</h2>

<p>This example was cobbled together with Svelte/Sapper, Fauna, and deployed on Now.sh. Most of this concept is based off of this <a href="https://www.smashingmagazine.com/2020/06/static-sites-jamstack-apps-faunadb/">Smashing Magazine Fauna tutorial</a> but I rewrote most of the tutorial to work for Svelte/Sapper.
</p>

<p>
Github: <a href="https://github.com/janzheng/web-money-guestbook">https://github.com/janzheng/web-money-guestbook</a>
</p>
<p>
Cobbled together at the last minute by <a href="https://janzheng.com">Jan Zheng</a>
</p>


<!-- {#if !isLoading}
	{#if !userData}
		<h2>Please login first!!</h2>
	{:else}
		<MessageComponent />
	{/if}
{/if} -->



