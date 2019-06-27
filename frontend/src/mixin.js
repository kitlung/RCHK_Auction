export const globalFunction = {
    methods: {
        GET_APP_PERMISSION: function () {
            return new Promise((resolve, reject) => {
                var payload = {
                    url: 'auction.rchk.edu.hk',
                    jwtKey: localStorage.getItem('jwtKey')
                }
                
                this.$http.post('/api/rcapps/app-permission',payload)
                    .then(res => {
                        if(res.data.result == 'Success' && res.data.permission == true){
                            resolve('success')
                        }else{
                            reject(res.data.message)
                        }
                    })
                    .catch(err => {
                        reject(err)
                    })
            })

        },
        INITIALIZE: function () {
            return new Promise((resolve, reject) => {
                this.$http.post('/api/rcapps/jwtkey-weblogin',{'jwtKey': localStorage.getItem('jwtKey')})
                .then(res => {
                    if(!res.data.weblogin){
                        this.$router.push('/unauthorized')
                        reject()
                    }else{
                        this.$store.dispatch('FETCH_USER_INFO', res.data.weblogin)
                        .then(() => {
                            this.$store.dispatch('FETCH_ITEM_LIST')
                            .then(() => {
                                resolve()
                            })
                            .catch(err => {
                                reject()
                            })
                        })
                    }
                })
                .catch(err => {
                    this.$router.push('/unauthorized')
                    reject()                    
                })
            })
        },
        TOGGLE_SUBSCRIPTION: function (itemID) {
            this.$http.put('/api/auction/v1/subscription',{
                itemID: itemID,
                userID: this.$store.state.user.userID
            })
                .then(res => {
                    this.INITIALIZE()
                })
                .catch(err => {
                    this.$notify({group: 'foo',type: 'error',title: 'Error.',text: 'Please try again later.'})
                })
        },
    }
}