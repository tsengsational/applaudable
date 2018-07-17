<template>
    <div class="dashboard">
        <h1>Welcome, {{user.displayName}}</h1>
        
        <div class="programs">
            <h3>Programs</h3>
            <div class="button-container">
                <button class="add-new-program" @click="handleNewProgram" >
                    <font-awesome-icon icon="plus-circle" ></font-awesome-icon> New Program
                </button>
            </div>
            <div class="programs-flex-container" >
                <dash-program v-for="(program, key) in programs" :key="key" :user="user" :program="program" ></dash-program>
            </div>
        </div>
        <div class="organizations" >
            <h3>Organizations</h3>
            <div class="button-container">
                <button class="add-new-org" @click="handleNewOrg" >
                    <font-awesome-icon icon="plus-circle" ></font-awesome-icon> New Organization
                </button>
            </div>
            <div class="orgs-container">
                <dash-org v-for="(organization, key) in organizations" :key="key" :user="user" :organization="organization" class="organization" >
                </dash-org>
            </div>
        </div>
    </div>    
</template>

<script>
import {auth, db} from '../main'
import DashProgram from './DashProgram'
import DashOrg from './DashOrg'

export default {
    data () {
        return {
            organizations: [],
            programs: []
        }
    },
    props: ["user"],
    components: {
        DashProgram, DashOrg
    },
    firestore () {
        return {
            organizations: db.collection("users").doc(this.user.uid).collection("organizations"),
            programs: db.collection("programs").where("uid", "==", this.user.uid)
        }
    },
    methods: {
        handleNewProgram() {
            const path = {
                name: "newPrograms"
            }
            this.$router.push(path)
        },
        handleNewOrg() {
            const path = {
                name: "newOrganizations"
            }
            this.$router.push(path)
        }
    }
}
</script>

<style lang="scss" scoped >
    @import '../assets/settings.scss';

    .dashboard {
        text-align: left;
        width: 80%;
        position: relative;
        left: 10%;
        padding-top: 44px;
        .programs, .organizations {
            h3 {
                display: inline-block;
            }
        }
        .button-container {
            display: inline-block;
            margin: 0 32px;
            .add-new-program, .add-new-org {
                cursor: pointer;
                @include button(150px, 40px, 12px)
            }
        }
        .programs-flex-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            margin: 32px 0;
        }
        .orgs-container {
            margin: 32px 0;
        }
    }
</style>
