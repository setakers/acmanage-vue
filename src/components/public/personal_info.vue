<template>
    <div>
        <h1>页面测试</h1>
    </div>
</template>

<script>
    import checkLogin from '../../modules/checkLogin';

    export default {
        name: "person_info",
        beforeCreate: function(){
            checkLogin(this);
        }
    }
</script>

<style scoped>

</style>