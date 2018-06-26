<template>
    <div class="login">
        <h3>
            Sign in
        </h3>
        <form action="" @submit="signUp" >
            <input type="text" placeholder="E-mail">
            <input type="password" placeholder="Password">
            <button  >Sign in</button>
        </form>
    </div>
</template>

<script>

export default {
    methods: {
        signUp: function(event) {
            event.preventDefault()
            let email = event.target[0].value
            let password = event.target[1].value
            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
            });     
        }
    }
    
}
</script>

