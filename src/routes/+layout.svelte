<script>
  import "../app.scss";
  import '@picocss/pico/css/pico.css'
</script>


<div class="main">
  <slot />
</div>

<style>
  .main {
    height: 100vh;
  }
</style>
