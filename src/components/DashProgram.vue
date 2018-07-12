<template>
    <div class="program-dash">
        {{program.title}}
                <button class="view-btn" @click="handleViewClick" >
                    View
                </button>
                <button class="edit-btn" @click="handleEditClick" >
                    Edit
                </button>
                <button class="delete-btn" >
                    Delete
                </button>  
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    props: ['program', 'user'],
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
        handleViewClick() {
            const path = {
                name: "viewProgram",
                params: {
                    id: this.program.id
                }
            }
            this.$router.push(path)
        }
    }
    
}
</script>

<style lang="scss">
    @import '../assets/settings.scss';
    
    .view-btn, .edit-btn, .delete-btn {
        @include button(100px, 40px);
        margin: 0 10px;
    }

</style>
