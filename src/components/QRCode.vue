<template>
    <div class="qr-code">
        <div class="instructions">
            <p>Print this page or save QR code to your computer</p>
        </div>
        <div class="code" >
            <vue-qr :size="200" :text="url" >
            </vue-qr>
            <p>Scan with your phone's QR reader or go to </p>
            <p>{{url}}</p>

        </div>
    </div>
</template>

<script>
import VueQr from 'vue-qr'
import {db} from '../main.js'

export default {
    components: {
        VueQr
    },
    computed: {
        url() {
            return process.env.VUE_APP_ROOT_PATH + '/programs/' + this.$route.params.id
        },
        backgroundImage() {
            if(this.program) {
                return this.program.image
            } else {
                return null
            }
        }
    },
    firestore() {
        return {
            program: db.collection("programs").doc(this.$route.params.id)
        }
    },
    data() {
        return {
            program: {}
        }
    }    
}
</script>

<style lang="scss" scoped>
    @import '../assets/settings.scss';

    .qr-code {
        .instructions {
            position: relative;
            top: 35px;
        }
        .code {
            position: relative;
            top: calc(50vh - (279px/2) - 35px);
        }
        p {
            font-family: $body-font
        }
    }

</style>

<style lang="scss">
    @media print {
        .nav-wrapper, .instructions {
            display: none
        }
        .code {
            position: relative;
            top: 0;
        }
    }
</style>

