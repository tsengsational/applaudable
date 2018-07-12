<template>
    <div class="credit" :class="{featured: credit.featured}" @click="$emit('creditClick', credit)" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" >
        <div class="credited-role" >
            {{displayRole}}
        </div>
        <div class="name">
            {{credit.name}}
        </div>
        <button class="edit-btn credit-btn" :class="{show: showEditBtn }" @click="handleEditClick" v-if="showEditFormBtn" >
                <font-awesome-icon icon="edit" ></font-awesome-icon>
        </button>
    </div>
</template>

<script>
import {db, storage} from '../main';

export default {
    props: ["credit", "type", 'editing', 'programId', 'creditType', 'editing'],
    data: function(){
        return {
            showEditBtn: false
        }
    },
    computed: {
        displayRole: function() {
            return this.credit[this.type]
        },
        showEditFormBtn: function() {
            if (this.creditType === "cast" || this.creditType === "creative") {
                return this.editing
            } else if (this.creditType === "staff") {
                return false
            }
        }
    },
    methods: {
        handleEditClick: function(event) {
            event.stopPropagation()
            const id = this.credit.id
            this.$router.push({name: "editCredit", params: {id: id, programId: this.programId, creditType: this.creditType}})
        },
        handleMouseEnter: function() {
            if(this.editing) {
                this.showEditBtn = true
            }
        },
        handleMouseLeave: function() {
            if(this.editing) {
                this.showEditBtn = false
            }
        }
    }
}
</script>

<style lang="scss">
    @import '../assets/settings.scss';

    .credit {
        position: relative;
        font-family: $body-font;
        width: 130px;
        padding: 16px 0;
        align-self: flex-start;
        button.edit-btn.credit-btn {
            z-index: 2;
            bottom: 0;
            right: 0;
            padding-left: 8px
        }
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

