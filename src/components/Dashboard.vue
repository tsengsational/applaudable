<template>
    <div class="dashboard">
        <h1>Welcome, {{user.displayName}}</h1>
        <div class="programs">
            <h3>Programs</h3>
            <dash-program v-for="(program, key) in programs" :key="key" :user="user" :program="program" ></dash-program>
        </div>
        <div class="organizations" >
            <h3>Organizations</h3>
            <div v-for="(organization, key) in organizations" :key="key" class="organization" >
                {{organization.name}}
            </div>
        </div>
    </div>    
</template>

<script>
import {auth, db} from '../main'
import DashProgram from './DashProgram'

export default {
    data () {
        return {
            organizations: [],
            programs: []
        }
    },
    props: ["user"],
    components: {
        DashProgram
    },
    firestore () {
        return {
            organizations: db.collection("users").doc(this.user.uid).collection("organizations"),
            programs: db.collection("programs").where("uid", "==", this.user.uid)
        }
    },
    methods: {
    
    }
}
</script>

<style lang="scss">
    @import '../assets/settings.scss';

    .dashboard {

    }
</style>
