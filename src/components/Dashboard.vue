<template>
    <div class="dashboard">
        <h1>Welcome, {{user.displayName}}</h1>
        <div class="organizations" >
            <h3>Organizations</h3>
            <div v-for="(org, key) in organizations" :key="key" class="organization" >
                {{organization.name}}
            </div>
        </div>
    </div>    
</template>

<script>
import {auth, db} from '../main'

export default {
    data: function() {
        return {
            currentUser: auth.currentUser,
            organizations: [],
            user: {}
        }
    },
    created: function() {
        const uid = this.currentUser.uid
        db.collection("users").doc(`${uid}`)
            .then((user)=> {
                this.user = user
                this.organizations = user.collection("organizations")
            })
    }
}
</script>

<style lang="scss">

</style>
