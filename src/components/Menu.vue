<template>
    <div class="menu" :class="{open: menuOpen}" >
        <router-link v-for="(link, key) in links" :key="key" tag="a" class="router-link" :to="link.path" >
                <a>{{link.title}}</a>
        </router-link>
        <div class="router-link sign-out" @click="signOut" >
            <a>Sign Out</a>
        </div>
    </div>
</template>

<script>
import {auth} from '../main';


export default {
    props: ["links", "menuOpen"],
    methods: {
        signOut: function() {
            auth.signOut().then(function() {
            console.log("signed out")
            }).catch(function(error) {
            throw error
            });
        }
    }
}
</script>

<style lang="scss">
    @import '../assets/settings.scss';
    .menu {
        display: block;
        position: fixed;
        width: 100%;
        padding: 16px;
        box-sizing: border-box;
        text-align: center;
        border: 1px $black solid;
        background-color: $white;
        z-index: 1;
        top: -100%;
        transition: top .6s;
        &.open {
            top: 40px;
        }
        .router-link {
            display: block;
            color: $black;
            text-decoration: none;
            transition: color .3s;
            &:hover {
                color: $yellow;
            }
            &.sign-out {
                cursor: pointer;
            }
        }
    }
</style>
