<template>
    <div class="credit" :class="{featured: credit.featured}" >
        <div class="credited-role" >
            {{displayRole}}
        </div>
        <div class="name">
            {{credit.name}}
        </div>
    </div>
</template>

<script>
export default {
    props: ["credit", "type"],
    data: function(){
        return {

        }
    },
    computed: {
        displayRole: function() {
            return this.credit[this.type]
        }
    }
}
</script>

<style lang="scss">
    @import '../assets/settings.scss';

    .credit {
        font-family: $body-font;
        width: 130px;
        padding: 16px 0;
        align-self: flex-start;
        .credited-role {
            text-transform: uppercase;
            font-size: 10px;
        }
        .name {
            font-size: 14px;
            font-weight: 900;
        }
        &.featured {
            width: 200px;
            .credited-role {
                font-size: 14px;
            }
            .name {
                font-size: 20px;
            }
        }
    }
</style>

