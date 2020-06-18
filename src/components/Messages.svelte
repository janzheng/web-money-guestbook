<!-- 

	from tutorial: https://www.smashingmagazine.com/2020/06/static-sites-jamstack-apps-faunadb/

	Consolidated files since I hate component hell

 -->


<script>

	export let messages, sigName, sigPointer, sigMessage, sigResponse, userData, errorMessage

	const getPrettyDate = (ts) => {
		const dateObj = new Date(ts / 1000);
		return `${dateObj.toLocaleString('default', {weekday: 'long'})}, ${dateObj.toLocaleString('default', { month: 'long' })} ${dateObj.getDate()} at ${dateObj.toLocaleTimeString('default', {hour: '2-digit',minute: '2-digit', hour12: false})}`
	}

	const loadMessages = async () => {
    messages = await fetch(`api/messages`).then(r => r.json())
	} 

	const signGuestbook = async () => {
		const data = {
			sigName,
			sigMessage,
			sigPointer
		}


		if(!sigName || !sigMessage || !sigPointer) {
			errorMessage = "Please fill in your name, message, and payment pointer!"
		}

		try {
			const response = await fetch(
				`/api/messages`, {
				headers: {
		      'Content-Type': 'application/json'
		    },
				method: 'POST',
				body: JSON.stringify(data)
			})

			// console.log('response:', response)

			// success
			if(response.status == 200) {
				sigResponse = await response.json()
				console.log('signed successfully:', response)
				loadMessages() // reload messages, since no db stream
				// sigName = ''
				sigMessage = ''
			}

			// error
			if(response.status == 400) {
				error = 'Server error'
				// url = ''
				// isLoading = false
			}

		} catch(err) {
			console.error('signature post error:', err)
			// error = err.message
			// isLoading = false
		}
	}



</script>

<section className="section">
  <div className="container container--small">

		<section className="section">
      {#if messages}
				{#each messages.data as sig}
					<div class="_card _padding">
						<div class="_grid-2">
							<div class=""><strong>{sig.data.username}</strong></div>
							<div class="_font-small _right">{ getPrettyDate(sig.ts) }</div>
						</div>
						<p class="_padding-top">{sig.data.message}</p>
					</div>
				{/each}
			{/if}



    </section>

		<section class="Formlet _padding-top-2" >
			<div class="Formlet Formlet-input _form-control _divider-bottom">
				<label for="sigName" class="_form-label">Username</label>
				<input id="sigName" name="sigName" bind:value={sigName} required="required" type="text" class="_form-input __width-full"> 
			</div>

			<div class="Formlet Formlet-input _form-control _divider-bottom">
				<label for="sigPointer" class="_form-label">Your $pointer</label>
				<input id="sigPointer" name="sigPointer" bind:value={sigPointer} required="required" type="text" class="_form-input __width-full"> 
			</div>


		  <div class="Formlet Formlet-textarea _form-control">

		    <label for="sigMessage" class="_form-label">Your message
		    <textarea id="sigMessage"
		              ref="textarea"
		              name="sigMessage"
		              rows="4"
		              class="_form-input _block" 
		              type="text"
		              bind:value={sigMessage}
		    />
			</div>
			<div>
				<input type="submit" value="Sign the Guestbook" class="_button __outline __width-full __action _margin-bottom-none" on:click|preventDefault={signGuestbook}> 
			</div>

			{#if errorMessage}
				<div class="_margin-top">
					{ errorMessage }
				</div>
			{/if}

		</section>

  </div>
</section>


