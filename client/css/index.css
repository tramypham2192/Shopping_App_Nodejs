/* GLOBAL */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
html {
    /* font-size: 18px; */
    /* 1rem = 18px */
    /* không khai báo fs */
    /* 1rem = 16px */
    font-size: 16px;
    scroll-behavior: smooth;
}
body {
    font-family: "Montserrat", sans-serif;
    color: #212529;
    background-color: white;
    letter-spacing: 1px;
}

button {
    background-color: #ff0e83;
    color: white;
    border: 1px solid white;
    border-radius: 5px;
    padding: 13px 32px;
    font-size: 0.875rem;
    cursor: pointer;
    letter-spacing: 1px;
    transition: all 0.5s;
}
button:hover {
    background-color: white;
    color: black;
    border-color: #ff0e83;
}

h2{
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 3rem;
    text-align: center;
    letter-spacing: 2px;
}

/* HEADER */
a {
    text-decoration: none;
    color: #000;
  }
  .site-header {
    border-bottom: 1px solid #ccc;
    padding: .5em 1em;
  }

  .site-header::after {
    content: "";
    display: table;
    clear: both;
  }

  .site-identity {
    float: left;
  }

  .site-identity h1 {
    font-size: 1.5em;
    margin: .7em 0 .3em 0;
    display: inline-block;
  }

  .site-identity img {
    max-width: 55px;
    float: left;
    margin: 0 10px 0 0;
  }

  .site-navigation {
    float: right;
  }

  .site-navigation ul, li {
    margin: 0;
    padding: 0;
  }

  .site-navigation li {
    display: inline-block;
    margin: 1.4em 1em 1em 1em;
  }

  /* GALLERY */
.gallery{
    padding: 70px 0;
}
.gallery__content{
    display: grid;
    grid-template-columns: repeat(4,1fr);
    /* grid-gap: ; */
    gap:30px;
    padding: 0 15px;
}
.gallery__g1{
    /* grid-column:1 / 3; */
    grid-column:1 / span 2;
}
.gallery__g6{
    /* grid-column: 3 / 5; */
    grid-column: 3 / span 2;
}

.gallery__item img{
    width: 100%;
    height: 100%;
    display: block;
}
.gallery__item{
    position: relative;
    overflow: hidden;
}
.gallery__overlay{
    position: absolute;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color:rgba(48, 132, 163, 0.2) ;
    color: white;
    padding: 38px 28px;
    text-align: right;
}
.gallery__overlay p{
    position: absolute;
    bottom:38px;
    right:28px;
    font-size: 0.75rem;
    transform: translateY(50px);
    opacity: 0;
    transition: all .5s;
}
.gallery__item:hover .gallery__overlay p{
    transform: translateY(0);
    opacity: 1;
}
.gallery__overlay h3{
    font-size: 1.875rem;
    transform: translateY(20px);
    transition: all .5s;
}
.gallery__item:hover .gallery__overlay h3{
    transform: translateY(0);
}

.gallery__overlay h3 span{
    font-weight: 300;
}

/* .gallery__overlay h3::before{
    content: "The ";
}
.gallery__overlay h3::after{
    content: " !";
} */
.gallery__overlay h3::after{
    content: "";
    width: 100%;
    height: 5px;
    display: block;
    background-color: white;
    margin-top: 10px;
    transform: translateY(20px);
    opacity: 0;
    /* display: none; */
    transition: all .5s;
}

.gallery__item:hover .gallery__overlay h3::after{
    transform: translateY(0);
    opacity: 1;
    /* display: block; */
}