<template>
    <div class="program-dash">
        <div class="text" @click="handleViewClick" >
            <h3>
                {{program.title}}
            </h3>
            <h5>
                {{program.subtitle}}
            </h5>
        </div>
        <div class="image" :style="imageStyle">
        </div>
        <div class="button-container" :class="{open: menuOpen}">
            <button class="menu-btn" @click="toggleMenuOpen" >
                <font-awesome-icon icon="ellipsis-v" ></font-awesome-icon>
            </button>
            <button class="view-btn" @click="handleLinkClick" @mouseenter="handleLinkEnter" @mouseleave="handleLinkLeave" >
                <font-awesome-icon icon="link" ></font-awesome-icon>
                <input class="link" :value="url" >
                <div class="tooltip-container">
                    <div class="tooltip" :class="{alert: alert}" >
                        {{tooltip}}
                    </div>
                </div>
            </button>
            <button class="edit-btn" @click="handleEditClick" >
                <font-awesome-icon icon="edit" ></font-awesome-icon>
            </button>
            <button class="qr-btn" @click="handleQrClick" >
                <font-awesome-icon icon="qrcode" ></font-awesome-icon>
            </button>
            <button class="delete-btn" @click="handleDeleteClick" >
                <font-awesome-icon icon="trash-alt" ></font-awesome-icon>
            </button>  
        </div>
        <div class="trash-modal-container" v-if="trashConfirm" :class="{open: trashOpen}">
            <div class="trash-modal-background"></div>
            <div class="trash-modal" >
                <button class="close-modal" @click="handleDeleteClose">
                    <font-awesome-icon icon="times" ></font-awesome-icon>
                </button>
                <span class="close-modal-text">
                    Are you sure?
                </span>
                <button class="delete-btn" @click="handleDeleteSubmit">
                    <font-awesome-icon icon="trash-alt"></font-awesome-icon>
                    DELETE
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import {db, storage} from '../main.js'

export default {
    data() {
        return {
            menuOpen: false,
            tooltip: "click to copy link",
            alert: false,
            trashConfirm: false,
            trashOpen: false
        }
    },
    props: ['program', 'user'],
    computed: {
        imageStyle () {
            return {
                backgroundImage: `url(${this.program.image})`
            }
        },
        url () {

            return `${process.env.VUE_APP_ROOT_PATH}/programs/${this.program.id}`
        }
    },
    methods: {
        handleEditClick() {
            const path = {
                name: "editProgram",
                params: {
                    id: this.program.id
                }
            }
            this.$router.push(path)
        },
        handleDeleteClick() {
            this.trashConfirm = true
            setTimeout(()=> {
                this.trashOpen = true
            }, 100)
        },
        handleDeleteClose() {
            this.trashOpen = false
            setTimeout(() => {
                this.trashConfirm = false
            }, 600)
        },
        handleDeleteSubmit: async function() {
            const programRef = db.collection("programs").doc(this.program.id)
            const creativeRef = programRef.collection("creative")
            const storageRef = storage.ref()
            let batch = db.batch()
            const creativeQuery = await creativeRef.get()
            creativeQuery.forEach((creative) => {
                if (creative.data.imagePath) {
                    const imageRef = storageRef.child(creative.data.imagePath)
                    imageRef.delete()
                }
                    batch.delete(creative)
            })
            const castRef = programRef.collection("cast")
            const castQuery = await castRef.get()
            castQuery.forEach((cast) => {
                if (cast.data.imagePath) {
                    const imageRef = storageRef.child(creative.data.imagePath)
                    imageRef.delete()
                }
                    batch.delete(cast)     
            } )
            if (this.program.image) {
                const rawPath = this.program.image.substring(this.program.image.indexOf("images"), this.program.image.indexOf("?alt")).trim()
                const path = rawPath.replace(/%2F/g, '/')
                storageRef.child(path).delete()
            }
            batch.delete(programRef)
            batch.commit()
                .then(() => {
                    console.log("batch committed")
                })
        },
        handleLinkClick(event) {
            const copyText = event.target.querySelector(".link")
            copyText.select()
            document.execCommand("copy")
            this.tooltip = "url copied"
        },
        handleLinkEnter() {
            console.log("entering")
            this.alert = true
        },
        handleLinkLeave() {
            console.log("leaving")
            this.alert = false
            setTimeout( () => {
                this.tooltip = "click to copy link"
            }, 300)
        },
        handleViewClick() {
            const path = {
                name: "viewProgram",
                params: {
                    id: this.program.id
                }
            }
            this.$router.push(path)
        },
        handleQrClick() {
            const path = {
                name: "QRProgram",
                params: {
                    id: this.program.id
                }
            }
            this.$router.push(path)
        },
        toggleMenuOpen() {
            return this.menuOpen = !this.menuOpen
        }
    }
    
}
</script>

<style lang="scss" scoped>
    @import '../assets/settings.scss';

    .program-dash {
        width: 85%;
        height: 195px;
        position: relative;
        left: 5%;
        padding: 8px;
        box-sizing: border-box;
        border: 1px $gray solid;
        background-color: $white;
        box-shadow: 2px 1px 1px rgba(0,0,0,0.15);
        margin-bottom: 32px;

        &::before, &::after {
            content: "";
            box-shadow: 2px 1px 1px rgba(0,0,0,0.15);
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: #eee;
        }

        &::before {
            left: 7px;
            top: 5px;
            z-index: -1;
        }

        &::after {
            left: 12px;
            top: 10px;
            z-index: -2;
        }

        h3 {
            margin-bottom: 8px;
        }
        h5 {
            margin-top: 0px;
        }

        .text {
            display: inline-block;
            width: 60%;
            vertical-align: top;
            cursor: pointer;
            padding: 0 10px;
            box-sizing: border-box;
            transition: color .3s;
            &:hover {
                color: $yellow;
            }
        }

        .image {
            width: 40%;
            height: 150px;
            background-size: cover;
            background-position: center;
            display: inline-block;
        }
        .button-container {
            margin-top: 8px;
            position: relative;
            .menu-btn, .view-btn, .edit-btn, .qr-btn, .delete-btn {
                position: absolute;
                @include button(40px, 40px, 14px);
                margin: 0 5px;
                border-radius: 50%;
                right: 0px;
                transition: transform .4s, opacity .4s, background-color .3s, color .3s;
            }
            input.link {
                z-index: -100;
                position: absolute;
                opacity: 0;              
            }
            .tooltip {
                position: absolute;
                display: flex;
                align-items:center;
                justify-content: center;
                padding: 5px 5px;
                top: -80px;
                left: -28px;
                background-color: $yellow;
                font-family: $body-font;
                font-size: 11px;
                text-transform: none;
                color: black;
                width: 80px;
                height: 40px;
                opacity: 0;
                transition: opacity .3s;
                text-align: center;
                box-sizing: border-box;
                &.alert {
                    opacity: 1;
                }
                &::after {
                        content: " ";
                        position: absolute;
                        top: 100%; /* At the bottom of the tooltip */
                        left: 50%;
                        margin-left: -5px;
                        border-width: 5px;
                        border-style: solid;
                        border-color: $yellow transparent transparent transparent;
                }
            }

            .tooltip-container {
                position: relative;
            }
            .view-btn, .edit-btn, .qr-btn, .delete-btn {
                opacity: 0;
            }
            .menu-btn {
                z-index: 2;
            }

            &.open {
                .view-btn {
                    transform: translate(-45px);
                    opacity: 1;
                }
                .edit-btn {
                    transform: translate(-90px);
                    opacity: 1;
                }
                .qr-btn {
                    transform: translate(-135px);
                    opacity: 1;
                }
                .delete-btn {
                    transform: translate(-180px);
                    opacity: 1;
                }
            }
        }

        .trash-modal-container {
            .trash-modal-background {
                opacity: 0;
                transition: opacity .6s;
                background-color: $black;
                position: fixed;
                height: 100vh;
                width: 100vw;
                top: 0;
                left: 0;
                z-index: 5;
            }
            .trash-modal {
                background-color: $white;
                width: 250px;
                height: 120px;
                position: fixed;
                z-index: 5;
                top: calc(50vh - 60px);
                left: calc(50vw - 125px);
                opacity: 0;
                transition: opacity .6s;
                font-family: $body-font;
                .close-modal {
                    position: absolute;
                    top: 5px;
                    left: 5px;
                    padding-left: 5px;
                    @include button (20px, 20px, 14px)
                }
                span.close-modal-text {
                    display: block;
                    position: relative;
                    top: calc(50% - 10px);
                    text-align: center;
                }
                button.delete-btn {
                    @include button (100px, 30px, 12px);
                    display: block;
                    position: absolute;
                    bottom: 10px;
                    left: calc(50% - 50px);
                }
            }
            &.open {
                .trash-modal-background {
                    opacity: .5;
                }
                .trash-modal {
                    opacity: 1;
                }
            }
        }
    }
    
    @media (min-width: 500px) {
        .program-dash {
            display: inline-block;
            width: 300px;
            height: 400px;
            left: 0;
            margin: 0 32px 32px;
            h3, h5 {
                display: block;
            }
            .text {
                width: 80%;
                display: block;
                position: relative;
                left: 10%;
            }
            .image {
                display: block;
                width: 150px;
                height: 220px;
                position: relative;
                left: calc((150px/2) - 8px);
                background-size: cover;
                background-position: center;
            }
            .menu-btn, .view-btn, .edit-btn, .qr-btn, .delete-btn {
                bottom: -57px;
            }
        }
    }

</style>
