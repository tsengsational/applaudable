<template>
    <div class="nav-wrapper" >
        <div class="nav">
            <div class="logo-container" >
                <div class="logo" >
                    <img src="../assets/applaudable_logo.svg" />
                </div>
                <div class="logo-text">
                    <span>Applaudable</span>
                </div>
            </div>
            <div class="router-links" >
                <router-link v-for="(link, key) in links" :key="key" tag="a" class="router-link" :to="link.path" >
                    <a>{{link.title}}</a>
                </router-link>
            </div>
            <button class="menu-btn" @click="handleMenuClick" v-bind:class="{menuOpen: menuOpen}">
                <div class="menu-top" @click="handleMenuClick"></div>
                <div class="menu-mid" @click="handleMenuClick"></div>
                <div class="menu-btm" @click="handleMenuClick"></div>
            </button>
        </div>
        <Menu :links="links" :menuOpen="menuOpen" />
    </div>
</template>

<script>
import Menu from './Menu'

export default {
    components: {
        Menu
    },
    data: function() {
        return {
            menuOpen: false,
            links: [
                {
                    title: "Home",
                    path: "/"
                },
                {
                    title: "Sign in",
                    path: "/login"
                },
                {
                    title: "Test",
                    path: "/test"
                }
            ]
        }
    },
    computed: {
        getLink: function(path) {
            return path
        }
    },
    methods: {
        handleMenuClick: function() {
            this.menuOpen = !this.menuOpen
        }
    }     
}
</script>

<style lang="scss">
    @import '../assets/settings.scss';
    .nav {
        padding: 5px 0;
        height: 40px;
        background-color: $yellow;
        text-align: right;
        position: fixed;
        top: 0;
        box-sizing:border-box;
        z-index: 2;
        width: 100%;
        .logo-container, .router-links, .logo, .logo-text {
            display: inline-block;
            vertical-align: middle;
        }
        .logo-container {
            position: absolute;
            left: 16px;
            top: 9px;
            .logo {
                img {
                    height: 25px;
                }
            }
            .logo-text {
                display: none;
            }
        }
        .router-links {
            display: none;
        }
        .menu-btn {
            border: 0;
            background-color: transparent;
            cursor: pointer;
            height: 35px;
            position: absolute;
            right: 0;
            padding: 0 14px;
            top: calc(50% - 17.5px);
            width: 45px;
            &.menuOpen {
                .menu-top {
                    transform: rotate(45deg);
                    transform-origin: left center 0px;
                }
                .menu-mid {
                    opacity: 0;
                }
                .menu-btm {
                    transform: rotate(-45deg);
                    transform-origin: left center 0px;
                }
            }
        }
        .menu-btn>.menu-top, .menu-mid, .menu-btm {
            background-color: $black;
            height: 2px;
            margin-bottom: 4px;
            transition: transform .3s, opacity .3s;
            width: 17px;
            border-radius: 10px;
        }

    }

    @media (min-width: 500px) {
        .nav {
        padding: 16px 0;
        height: 70px;
        background-color: $yellow;
        text-align: right;
        position: relative;
        box-sizing:border-box;
        .logo-container, .router-links, .logo, .logo-text {
            display: inline-block;
            vertical-align: middle;
        }
        .logo-container {
            position: absolute;
            left: 16px;
            top: 9px;
            .logo {
                img {
                    height: 50px;
                }
            }
            .logo-text {
                margin-left: 6px;
                span {
                    font-size: 25px;
                    position: relative;
                    top: -3px;
                    color: $black;
                }
            }
        }
        .router-links {
            position: relative;
            top: 7px;
            right: 32px;
            .router-link {
                margin-right: 12px;
                text-transform: uppercase;
                text-decoration: none;
                color: $black;
                font-weight: 900;
                transition: color .3s;
                &:hover {
                    color: $white;
                }
            }
        }
        .menu-btn {
            display: none;
        }
    }
    }
</style>


