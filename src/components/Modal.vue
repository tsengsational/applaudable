<template>
    <div class="modal-container" >
        <div class="modal" :class="{open: modalOpen}" >
            <button @click="$emit('modalClose')" class="modal-btn" >X</button>
            <div class="modal-image" :style="styleObject" >
            </div>
            <div class="modal-name" >
                <a :href="modalCredit.link">{{modalCredit.name}}</a>
                
            </div>
            <div class="modal-role">
                {{modalCredit.role}}
            </div>
            <div class="modal-bio" >
                {{modalCredit.bio}}
            </div>
        </div>
    <div class="modal-background" :class="{open: modalOpen}" ></div>
    </div>
</template>

<script>
export default {
   props: ["modalCredit", "modalOpen"],
   data: function() {
       return {
       }
   },
   computed: {
       styleObject: function() {
           return {
               backgroundImage: `url(${this.modalCredit.image})`
           }
       }
   }
}
</script>

<style lang="scss">
    @import '../assets/settings.scss';

    .modal {
        width: 350px;
        height: 80vh;
        position: fixed;
        opacity: 0;
        top: calc(50% - (80vh/2));
        right: calc(50% - (350px/2));
        background-color: $white;
        transition: opacity .6s;
        z-index: -1;
        overflow: hidden;
        &.open {
        z-index: 6;
            opacity: 1;
        }
        .modal-image {
            width: 150px;
            height: 200px;
            background-position: center;
            background-size: cover;
            position: relative;
            margin-top: 16px;
            left: calc(50% - (150px/2))
        }
        .modal-name {
            margin: 10px 0 5px;
            font-size: 24px;
            line-height: 28px;
            font-weight: 900;
            a {
                text-decoration: none;
                color: $black;
                transition: color .3s;
                &:hover {
                    color: $yellow;
                }
            }
        }
        .modal-role{
            margin-bottom: 10px;
            font-family: $body-font;
            text-transform: uppercase;
        }
        .modal-bio {
            font-family: $body-font;
            overflow: scroll;
            height: 45%;
            text-align: justify;
            padding: 0 48px 0 16px;
            box-sizing: border-box;
            width: 378px;
        }
        .modal-btn {
            position: absolute;
            top: 10px;
            left: 10px;
            background-color: transparent;
            border: 0px;
            font-size: 18px;
        }
    }

    .modal-background {
        background-color: $black;
        opacity: 0;
        width: 100vw;
        height: 100vh;
        position:fixed;
        top: 0;
        left: 0;
        z-index: -1;
        transition: opacity .6s;
        &.open {
            z-index: 5; 
            opacity: .5;
        }
    }
</style>
