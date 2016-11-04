'use strict'

exports.handle = (client) => {
  // Create steps
  const sayHello = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().helloSent)
    },

    prompt() {
      client.addResponse('app:response:name:welcome')
      client.addResponse('app:response:name:provide/documentation', {
        documentation_link: 'http://docs.init.ai',
      })
      client.addResponse('app:response:name:provide/instructions')

      client.updateConversationState({
        helloSent: true
      })

      client.done()
    }
  })

  const untrained = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('app:response:name:apology/untrained')
      client.done()
    }
  })

  const handleClients = client.createStep({
  satisfied() {
    return false
  },

  prompt() {
    client.addTextResponse('We are proud to work with some very nice clients.')
    client.done()
  }
})

  client.runFlow({
    classifications: {
      clients: 'clients'
    },
    autoResponses: {
      // configure responses to be automatically sent as predicted by the machine learning model
    },
    streams: {
      clients: handleClients,
      main: 'onboarding',
      onboarding: [sayHello],
      end: [untrained],
    },
  })
}
