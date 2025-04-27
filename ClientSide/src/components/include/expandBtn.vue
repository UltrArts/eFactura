<template>
  <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" />

  <nav class="menu">
    <input type="checkbox" class="menu-open" name="menu-open" id="menu-open" />
    <label class="menu-open-button" for="menu-open">
      <span class="hamburger hamburger-1"></span>
      <span class="hamburger hamburger-2"></span>
      <span class="hamburger hamburger-3"></span>
    </label>

    <div class="tooltip">
      <a href="#" class="menu-item"> <i class="fa fa-bar-chart"></i> </a>
      <span class="tooltiptext">Relatórios</span>
    </div>
    <div class="tooltip">
      <a href="#" class="menu-item"> <i class="fa fa-plus"></i> </a>
      <span class="tooltiptext">Novo Item</span>
    </div>
    <div class="tooltip">
      <a href="#" class="menu-item"> <i class="fa fa-heart"></i> </a>
      <span class="tooltiptext">Favoritos</span>
    </div>
    <div class="tooltip">
      <a href="#" class="menu-item"> <i class="fa fa-envelope"></i> </a>
      <span class="tooltiptext">Mensagens</span>
    </div>
  </nav>
</template>

<style scoped>
.menu {
  position: fixed;
  bottom: 20px;
  right: 20px;
  filter: url("#shadowed-goo");
  width: 400px;
  height: 100px;
  padding-left: 80px;
  z-index: 999;
}

.menu-open {
  display: none;
}

.menu-item,
.menu-open-button {
  background: #00bcd4;
  border-radius: 100%;
  width: 60px;
  height: 60px;
  margin-left: -30px;
  position: absolute;
  bottom: 20px;
  color: white;
  text-align: center;
  line-height: 60px;
  font-size: 18px;
  transform: translate3d(0, 0, 0);
  transition: transform ease-out 200ms;
  cursor: pointer;
}

.menu-item:hover {
  background: white;
  color: #00bcd4;
}

.menu-open-button {
  z-index: 2;
  transition: all 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform: scale(1.1);
}

.menu-open-button:hover {
  transform: scale(1.2);
}

.hamburger {
  width: 20px;
  height: 3px;
  background: white;
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -10px;
  margin-top: -1.5px;
  transition: transform 200ms;
}
.hamburger-1 {
  transform: translate3d(0, -6px, 0);
}
.hamburger-2 {
  transform: translate3d(0, 0, 0);
}
.hamburger-3 {
  transform: translate3d(0, 6px, 0);
}

.menu-open:checked + .menu-open-button {
  transform: scale(0.8);
}

.menu-open:checked + .menu-open-button .hamburger-1 {
  transform: rotate(45deg);
}
.menu-open:checked + .menu-open-button .hamburger-2 {
  transform: scale(0.1, 1);
}
.menu-open:checked + .menu-open-button .hamburger-3 {
  transform: rotate(-45deg);
}

.menu-open:checked ~ .tooltip:nth-of-type(2) .menu-item {
  transform: translate3d(-90px, 0, 0);
}
.menu-open:checked ~ .tooltip:nth-of-type(3) .menu-item {
  transform: translate3d(-170px, 0, 0);
}
.menu-open:checked ~ .tooltip:nth-of-type(4) .menu-item {
  transform: translate3d(-250px, 0, 0);
}
.menu-open:checked ~ .tooltip:nth-of-type(5) .menu-item {
  transform: translate3d(-330px, 0, 0);
}

/* Tooltip */
.tooltip {
  position: absolute;
  bottom: 20px;
}
.tooltiptext {
  visibility: hidden;
  width: max-content;
  background-color: #333;
  color: #fff;
  text-align: center;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 6px;
  position: absolute;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
}
.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
</style>
