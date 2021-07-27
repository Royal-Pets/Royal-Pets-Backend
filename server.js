"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const server = express();
server.use(cors());

server.use(express.json());
const PORT = process.env.PORT || 3002;

const mongoose = require("mongoose");
mongoose.connect(
  `mongodb://${process.env.DB_CONF}@cluster0-shard-00-00.uvjqt.mongodb.net:27017,cluster0-shard-00-01.uvjqt.mongodb.net:27017,cluster0-shard-00-02.uvjqt.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-h1qilz-shard-0&authSource=admin&retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const messageModel = require("./MessageSchema.js");
const adoptModel = require("./AdoptSchema.js");
const cartModel = require("./CartScema.js");
// function seedUserCollection() {
//   const omar = new cartModel({
//     email: "omx302@gmail.com",
//     products: [
//       {
//         productName: "Food",
//         itsFor: "Dogs",
//         Price: "25",
//         image:
//           "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBYWFRgWFhUYGRgYGhoaGRocHBweGR0cHBgaHBoeHhkcIS4lHB4rIRoYJjgnKy8xNTU1HCQ7QDs0Py40NTEBDAwMEA8QHxISHzQrJSw9NDY2NTQ0NDQ2NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NP/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAAAQMEBQYCBwj/xAA8EAABAwIDBQYFAwMDBAMAAAABAAIRAyEEMUEFElFhcQYigZGh8DKxwdHhE0JSBxRiI4LxcqLC0hWSk//EABkBAAMBAQEAAAAAAAAAAAAAAAACAwQBBf/EACcRAAICAgICAQQCAwAAAAAAAAABAhEDIRIxQVEEEyJhoUKBMjNx/9oADAMBAAIRAxEAPwD2ZCEIAEIQgAQhCABCEIAEIQgBEIUDae02UGguNzYAZn8c1xtJWzqTbpE9Ks3hO1VNzwxzSwkSDIIAmL8FoWOBEgyDkuRkpdHXFx7O0IQmFBCEIAEIQgAQhCABCEIAEIQgAQhCABCEIAEIQgAQhCABCEIAEIQgAQhCAGMViGsa57jAaJK8k29in4iu0ucQC8BrQchNhPD8r0Ttc8f27mavgNHMEO+i88xODJABmRM6xrZY883fE2fGgqcmJSq0WO3i55fvFrgHMI8s4tNvqvSezmKDsOxxIENveYzz4cV5q3ZwaJzJGZ4zPzKhP2w9rHU2vIZEvAm4acuhJCXHJwfsplgpR0ewUtq0nO3RUaT6eByKnSvMcHsrFmgytTDan6rGugd17D/HvPAcOcjWdAtl2Ww1dtI/3Dd15Pw75fAFhaSGnkCeqvCc3KmtezJKEUrT/ovkIQrkgQhCABCEIAEIQgAQhCABCEIAEIQgAQhCABCEIAEiFxUqBoJOQXG6A7K4Dwciq6riS7kEyasLK/lJPS0WWFtbLpCrsBjd47pziQeP5U97oBJ0ErRGalG0TcXF0zN7XeX1939rB/3Efn/tVRicNuiY04KXg6hcaj3W3nwOgEn1cldX3ieBy6cfQrFKVttm2MeKozGMqQ117bro6RlPisxsmnvueD+4H5yPktB2kL2iACd6AAOLjbqZMKx2T2aFNoDr1XQTFw0E2HMAA+PgupaGci27Mba/RpCi9rnbh7pEfCTMGToSVqae02G9x4KgwWxoJLiMzEcIGfNWNHCMGhHQx1yTxyTWkQnCD2WrMU06+dk+CqxlBouB65p1kDKWzwPsKscr8kXBeCekUU4gtHeEjiPqE9SrB2RVFNN0I4tbHUIQnOAhCEACEIQAIQhAAhCEAKhCEACEIQAircZXkwLgfNSMbV3RE3Py1VOcQCSJWT5GWvtRfDC/uOq1UgTYKvdijnJ+3RO4lzSL70TEj7BVbsQyJBDm8+ViJHuy85ttm2KVE3Z+OmtTA+IuiOIg73orPtDtkUmljYLnCD/iCOA1WT7NVnVcU+q0SzDsc5x0LywgNHhJ8EvZx7sXu16kGAHngXuEgdANOnNb4XDH/wBM0kpT34LrC4fdYGnOPUkz5f8Aim6jQC6/IcohWREOyyHn7uVWYkFzIHxPdHm4z5AeigVTIf6M1DUdO4z4IGb93PoB69FfUgBlqCCeYggk9JHgoOEaCIgwN5seQE+CTC1yJZEkHdB5tiM/8SPJMpbFkrLqhn6j5/fyXT2a8CoWGcRBJyO6TyN2nz+asRJJHuVRbJvQg+R/4+yR7+Iscx7+aVzLz18Qcwke0ECDe8fYoadUcXY60yM5HvNQ6jt10DqF1QeWu3TkfQ/YrvFMkdPlquNWvydWmTsJULmglPqnwuM3RESJVnRxDXZH7+S1Y5JpK9kJRad+B5CEKogIQhAAhCEACEIQAqEIQAiEKLj3EMMZ/c3SyfFNnUrdFdjCXOPDLwCYNFrRl4AfRK1/DLz81w+qOq8mc1KTbN8YtKkRsbXAEGI/jksX2gx7mMIZ8bjDQBe/otDtbF8nGMgBJJ4Bup5KrwXZTE13mpWIoie4CA9/XdaYbrmZ5Ixxt2xpSUVRO7L1KeCw/wCmXbz3k1KnNzgAR0AAHmp3ZTCChh6bObyJ4b7tzyaWDwCZp9hqUkvr1nHkWtA8N0z5rQ0sA1rWtBcd0QCTeLZxmbKty8sm5R8IjvqWJ5OPkICr6FQOcAP2AE+MgefeVlitmFzSGuiWwJEx5Kl2Rga9F9QVGiHFm69pkEAO1F2gZXAzRFO7YWmtEjCPAfunN0jxaYvaRkfPkuMVUDahAsSJHUTeVzXYHFzxaBvk8LX6wRPioeJxIfuPmHM+IZSDDfz4IbsZIu8DVa8XMh4jmD7PorJjzrmLGNQs/gHQXQIMT43v74rQUKocAfeS7FiSQ9vS06kZhN1Hevrw+yQyLgXGnELhlUOHmI4ciF2UhUjjEA7vNt/D8FOUMQHjncEHlqo7a0WdoY8DZKHQT0Hpr75ril5GcSJUqbr3NJy7zde7y5iCjC4s707x3hkABaeIUftHTO6yo0Xa8Nd/0k/eFXM2iGwbkuyuJgC1uGfku1crOqqN1hMUHAA5xkpSymGxXdkG4IJ+yu8JjwQAbGPc8Fpx5k9MzzxNbRYoQChaCIIQhAAhCEACEJqrVDRJXG0lbOpWLVqhokqg2ji3Oe0CzQfX6/lSK9UuMkz9FErGLcLyvPzZpTTUejVixqO32chuhN1Cq0gX9wEvI3bcJ+QS4mvNtSYFtTYW0Mq1w1EMEZuPxH3os0YplnKhjDbPZT3XO7z/AOR0t+0afNShiCo2LfpOfNRHYqAOIkEc5+UJ3KujijfZYNrGfH6J1lWTeVAY+3NOtxA4+EH55KSk0zrjZMNUC0p2nU6x0VV+pvO7twMznpkE47Ey7dF3H34BOp0K4WOY3Z7XNdutAJB7toJII8M+iyLHDe3Swktm3GMxPHK3ERqtvQDgO8W+qzHarAFrm1mG0jfjKdCRzy8uKtdo5F06OqLy6HMM2mOWnvkrDAPDTEQTmBP1ULZ1ZobFgSZA5OE298VIrG8i03HXX1+am3Q/eizq1+GYNuKYx1bdIcG5i556ZeKWQ8ZCQM419ymXPiA5pAEmYy6rrl2cURg15eJyc38fRSmuki8WHqTZN0XtLS0g7pyPPKy5ps7wGYBA/K5fo60SNsENw7yf2tLvK6zGDa1zg8ZAd3mTy95KZ2+x36ez8Q4G5aGjj3ntb9Vluxe3G1GgvMEN3eh4Rw+6uk+PImnujVMeWOMzaTfW+vmptXEFu65hkE3jK1yPOVFxRc4jcEfDnnYCTHHqq7A1IqEHIXF+7JsJ+filqmOtm2w+LIAIyKs6VUOEhZKniIJANm3GWWotnHH0CtsNWNi1NHNLHLi9olPGpK12XaVNUqgcJ8wnVvTTVoytVoEIQunBCYVFisQXEm8DLorPaD4bHEx91SV3lrSY0WD5eT+KNXx4/wAjii8DvTaSPfqoOLxYJNxHRZej2sYXPoPMPa+WzqOXMXTGN2wD8LrCec+CgoPikaNWbDYdIPL6nxbp3WEjIx3iJ5EeZVrVnQgdfoU1QilSYyB3WiR/lEuPUkkqM6sD+/dPhCWTUdCpOTsTEYhgkEXGap8Vi278t0yJ8t2furNxdrDxP7bnwBj6qpx+KYLQLzIIg9IIS2iiiJhdpOLw1sxr8RyOkgDqrt+KIAb8ZdlH5yWSZtVm/DGkuaMouAc8+mlrKNju1DqXeLHPAkDSfPXhxXHGUnUUd0uzZYnGBo3GRvnM6DiT7ukwlZrTut+L9zjdx6nTos/hNqCo3/TY4z8Rc0tuRrOXqrVgjdDXAEfE7+UkT76Jaa7ClRf4erJvn1UqtTD2lrhIIgqowrhmSJVowtIzVccrJTjRkMNiZcA9gAplzC4RJ0EjzU5uKFxPQ8zb7rNdrdoNw2KewkN/UY2oJ+Eh0tN9DLXHxVJT7SAtguuOYv0OqeWOT2NGUaPQ8FjA4bwItYjXrb3ZTX4k7sxbTj48l5hhe0bGGZdYyRm2JvIC2eytpuxA/wBFro1cR3AOp+kqcoSQ/wBrLZncy9+7JHVxxBIF445eAuncPsh5Hffz7ufmR9FYM2TS1bvHUkm/UCyIY5PsnKcUeLf1H26XluGZZrDvPIyL47regBnqRwWP2RtA0Xh4Ngbj6wvofF9jcBVdvvwtPevJG80Em5LgwgOPM3WY23/SXDVBvYZ7qDhm0zUYRf8Ak7eacrycsl6EJR48TI75chNk7XbVotIdJdcnPwEaKTXoQ7ftoHfxLogehlee4nZWK2VWH6zT+k4w2o0l1NxibGLOz7pANjmLrWbP2s17RBtZwvPC44mFHJBrro0QmpKy+2VWDDuObckR0ynmZ15qywWNLHmmRzH/AEk91Ubam/UZEZDW4AzBHgSpHaDFlr6TwLFxaXDnkCf9rlPLG4/lDxe6fk2GHxRBB01VwDKzOGfvNBnMK82e+W9LJ/h5W3xZD5EEtoloQhegZSBtI/COv0VVjLsdbQqz2rbdPMjzUF8wbfJeX8n/AGM24P8AFHzf2lBGJfmCHHqpPZrGuficPTJB361JpnIgvaDI5hWn9SNmGniS6Ia8bw6ix+nms72fpuOKoBpgiox0jMbrg4nwAJWzE4yxp/glO1N0fSWJxDb7zZ6wq2o5jpAps6lohWdYtk5Dmbn8Ksrsa5262TOe6MuPRee9s0R0NUmsLZ/Tbcn4ASbH/G+hUTGPif8ATfBsBJPhDjKnGl+m0imSG/wgEzyM6lRXYqsHSKB3YzO7fxm3jCi1vRaLMZX2PiKtRzgP0mEWAsSN4aDSfkVOwGwG/qNY8hzG7vdiAIPmeq02IrFgG9BqOEmJsNALZD6qBhw84iReBLuAEfcj2E3OT0DS7LKrggBDpaNHtMQODpt5rpmyWNiHPcNSDM66C11LY4ZzLTY8ilZQLZ3HBsftIlvUXt4WQkK2OYem0ZOdbz8Qp1CIsZ6qG2uCYc3veR8HahS6TgNVSKJyPIv6zu/18Pa/6Tpgf58Vidk7NqYl25QY97uAFhzccgOq9Q/qdg/1KlHcbLi1wH/2Ezyv81ddi9gsw1M7vxuIc90QSYsOQHD7rZ9VRgl5I8G5X4GuxvYOlhmB2IayrWcZJI3mMjINDhEjMuImVuWsiyZY+RzXL8QIzuLqLne2d4vpDoMHO3DmunNlQXYkES055jrqm/7guZLI3oyJ8kikhuDJ4AvGaQPi0woWHxgI1kWcDmDH4XT3gtAMyBPzt5whulaO8d7H8bhaWJpPo1Wh1N43XNOvAg6EGCCLggFeK7Y2ZV2XiP0S4vpPl1F5AlzZu0/5NMTHEG0wvaqVgOefNZb+qWy/18C97RL8ORVbx3QIqeG6Sf8AYFoxT5LiybXF2jH7H2wN7jMfX7q52/WAZTbN3VG24xP/ALHyXl2C2nuQd7WY1Wk7PYp+OxlJsEMpAu9Ik+vqieOk2/A8ZptUevbLp/6bJ/iFd7OESq6nTgAaDmrPAarP8VfegzO4smoQheqYiPjae80hUzSYyyt7sr9wkKlrd0zzusXysd1JGjDLVGW7b9nf7ugQ0APb3mHmBkeRyXkvZikaVd5eN17Glu6RcOJv0sPVe+l05Ssj2s7KCuDVpdyvGZs14GQcRrwKz4s3G4Pp/ovKPKn5RodlY4VcOyoIJc3vW/cO67pcFSxDRzOZi54Acl5l2O7QOw1R+ExLXMJdvN3rd4i7eYdEgixM8V6JQfZr5kvEjgJE2HSETjTBbOa+834t0cI+IdYyzTLaokyRAAPiZ9LKVUDbBxknz6qqxbBv7syYJtAyECY5x5FSlEpFjFCm573OJAm99G/t1zsSrrBYRrLgQSACf3ZW65qvZQALrRDAZ6Gym4Zr4E2jLz+SIo7J2PMog5u7pJ6nxTjWBtjMftPDxStYCALzOnH/AJTD6Lnkh7yALOAiDeQcpv1TpUibZ3XYHNk96LiOP0KeExa9tFzuwJGnkVFxGMa1jnuO6Ggk8gBPihLYeCkxdYPxJbnuM3f9xMlvKwb5q/pHKCMsuPuVkNj1XVHGoe6Xkvnkch1AgLRF0OBJvx9fFck6dDUT8XXIu2w15KFiK4znj55ritimv32lw4ffrdZ3amI3HhsyHg3F4HINuTHDhyQouTBaRcuxQbAmxkDkZuOl1yce1jyZAAAny/Cwm0tsPILN10NPceRBdGRdzVb/APM1CyIi9zrbT5KqwtHOaPTMHjJzddxJPQ3ufJWLMSOYMzzAAgCOPJeX4HbRBEvAvPB3Xe/C1uA2ux0R3tbQY58ZtmknDih00zaYetJA4D8hSMS9ppvDiA0scCTkBumfRZ7D4qdVNxWMAovEBxLXANGbjBsBndLjnsSeM8H2lsPdEtueAuT0GpXq39PezP8Aa0d54/1akF2XdGjfD7qRsLsy1rhWrNBeLsbo3mRlvfJa2nSadB6KmXK8i4roRRUdnLWD3CtcE2G9SoDWS4cFasbAAV/i46dkc0rVDiEIW0ziKs2hTv1VmmMVS3hzGSSceURoOmZ5rtzIW4J5rw4Ei/LguK7YJUZgImLLzJwN0XZF232fo4pu7Wpgx8Lm2e08Q6ZHTLim8Hh6lBjWkuqNYGs3oJeWgRJaMzAFx5K5p4sWDh4rt0G4M9M/JS+5LT16O3vaIe6xzA7eFxYqvo4TdeXEg7wEA5hoJIy6nNXD2CQS0ki4tl6JABMlpjPL3ZdU0+9BvwQAwB7m/wAm3/2mDF7ZqfSMjdBnjoBGY5pptMCqHbtt1wsNZHD3ZOOqNiA4TJsni1VnJHTGxByORHMLqmJcTzg9NPWVFDxLpMH4hJ5Ktx+04a4giQDqb+Wv5XVJBxZPx+ItYZZgZx0XmXbntGd00273ftJtwm2eUBOdoe0zmtO4HAuNjN/AaDqsDjKj3kufJK0YsW+Uic50qR6h2NxZfTbBu20axHyWwa4FvfYDrJEheUdhsYWutJ6Z9V6RRx5HwAweMgCyhljUmisHyiVu3Y3muou3X/uDbgjoNVCpYV4DnA9/dmAwbw87C5HmrTH7QeLmBpOfooLazAC5znOPOwJ0ga5poulQNGbxeDqAy4l4dcG17Z28cuCO0dKs0UmUKZYxzQXmBDnXsTEizZt/JX2IYHtc94ECAxomxMwAOGp5gLrBUMSYY1p3BNnd1t28XRveqo8iWxODMtjNmjNoFgJjjrZc4HFfpkd62oMAjzzW9wnZo333tAOjY+enqrnBbCpMO8GNLhbfME/KB4LO8667K8a8lDsunXewFgDGn9z2k25NzPoFoMBs8Mzc57tXOz8ogBWbMPxNuPvNBe0Tui/H3mo1KXekdc/QMw4Fz+V3vkmBkmWOJNzKkUxdXhD0Sk/ZNwrZI5KwTGGpwJ1KfXpY48YmKbtioQhUFBIlQgCm2lQgzoVWOF1pq1IOBBWfxNEtJacxlz4FZMsKdmnFO1RGeEzSMEwb+/RSc1HIg9fx+FklE0JkoYsx3hPX/hPDFNPJQnNXD29VNxZ2kT3ATYzN9Eppg/E0ec+iqXTaPK3T30R+o7PePzU+FdIavyTMTgqLj3pnSHOH1VVjeytN8kVK7J/iWkeRaVObinDOE8zHO1HquLkn3QNaMZif6cMeZOJqk/5MaflCjVf6YzliT/8AlP8A5r0AY7kfBdf3o4eip9XJ7/QvFejA7I/p27DvDxiCeLf0rHx37dVr2bNdBBcSNOXRWIxzeB8gkdj2/wAXHyRKU5u5P9Alx0kVVbYTHCHOeOhAPmBKi09j4dh7rQTB7zy5x6d4q8djh/D1TFfFGDDR8z+FOSk9JjxavaEwlENyawcwAfWVM/SdqGqrZjKhAG9FpsI65/lOMLjckyb+l7z0Qoe7Z12WEtGs9NFxUxJvuiLeaYa1dOH05eaeMfQmjprnOu4z7lPpum1OO4K0YitnVMKfgqMnlqotCkXEAK6o0w0QFrwwvZnyTpUOoQhazMCEIQAIQhACKHjsMHjmMipiQhK4pqmdTp2ZZzC0kO8fuuHtB1V7jcMHciMj9CqGvRLXcFkyY6NUJ2cMy6JS1cF5BlOhwOt1ncS1jLm+/YTZb/ypLmptzJ9/NK0dTGgF00eC6A006pWrlHRGOPX30XQf7lIPH1Xfn6rtAcl06DxS7g8eVkpPsj8JAPLogUSdExiXgCNT8k8+oBYXJy4eaimZIIvIl3LPy0XBkcUWQfpERfONApzG2/4TFJlvHKL+/JSWi3v7oo62dgfhDBJlci9vfRPsamjERs7Nl3QYScrldU6U2VrhcMG3i6048bZGc0kd4WhujmpCELYkkqRlbt2xUIQunAQhCABCEIARCEIA4qNlVWMpg5hXChYukkkhosz1WnFk1Cm4lirKlYt0lZp4vKNMJ+zh7nNNnGPTySDFOi4B85S/3LH2BvwNj+UyVCS9lk7JjaoOi6NVoz18/NRqLtE69kj1SUA4HjQ+Y+yUVRqR6phmSUWMooYfL+C4c4ZEp0JvEU7TwRRyxsZyuQDM3uIvklaV2AijtjjKfvpp0T4ppljk9+s0Zn7p4xsSUgYyFKpUpTdJ+9kIVlhqa0QxeyEp+iRhqIClrljYSrSlXRnbtipUiVMcBCEIAEIQgAQhCAEQhCABcvbIXSEAU+MwypMXQWwqMBVVjMHySNDxkYTH4WdFR1cbWpnuvkDR1x55hbzFYJUeO2XOim432VUvRQU+1sfHTI5tM+hhWuF7XYZ2b90/5Aj1NlS43Yp4Kor7HdwSPFFjrJI9Ap7XoOuyowzoHBSG45h/cF5W7ZJ4LkbMdwSfQXs79V+j1tmOYM3DzXL9s0G/FVYOrgvKWbHcdFNw+wHHRH0F7D6n4NxiO0uGblVB5NBd8lFd2sabU6TnHiYaPqVU4Ps6NQtHgNigftTLEgc2cYfE4ipmQwcGj6m6u8Dgozz4qRhcCBorShh1SMEiUpWJhqCtKNOElClCfVUiTYIQhMKCVIlQAIQhAAhCEACEIQAiEIQAIQhAAmq2SELjOop8UquuhCRlEVWKVViEISjkF65ahC4A/SVhQQhAFphla4dCF1HGWNBTKSEJ0TZNalQhOICEIQAJUIQAIQhAAhCEAf/Z",
//       },
//     ],
//   });

//   omar.save();
// }
// seedUserCollection();

server.get("/adoptList", (req, res) => {
  adoptModel.find({}, (error, adoptData) => {
    if (error) {
      res.send("cant find user");
    } else {
      res.send(adoptData);
    }
  });
});

server.get("/userAdoptList", (req, res) => {
  adoptModel.find({ email: req.query.email }, (error, adoptData) => {
    if (error) {
      res.send("cant find user");
    } else {
      res.send(adoptData);
    }
  });
});

server.get("/messages", messagesHandler);

function messagesHandler(req, res) {
  messageModel
    .find()
    .or([{ sender: req.query.email }, { receiver: req.query.email }])
    .then((messageData) => {
      res.send(messageData);
    })
    .catch((error) => res.send("NOT FOUND"));
}

server.post("/addmessage", addmessageHandler);

function addmessageHandler(req, res) {
  messageModel.find({}, (error, messagesData) => {
    if (error) {
      res.send("cant find user");
    } else {
      let newMessage = new messageModel(req.body);
      messagesData.push(newMessage);
      newMessage.save();
      res.send("OK");
    }
  });
}

server.post("/addAdopt", addAdoptHandler);

function addAdoptHandler(req, res) {
  adoptModel.find({}, (error, adoptData) => {
    if (error) {
      res.send("cant find user");
    } else {
      let adopt = new adoptModel(req.body);
      adoptData.push(adopt);
      adopt.save();
      res.send(adoptData);
    }
  });
}

server.delete("/removeAdopt", removeAdoptHandler);

function removeAdoptHandler(req, res) {
  adoptModel.deleteOne(req.body, (error) => {
    if (error) {
      res.send("cant find user");
    } else {
      res.send("Deleted");
    }
  });
}

server.get("/products", productsHandler);

function productsHandler(req, res) {
  cartModel
    .find({ email: req.query.email })
    .then((messageData) => {
      res.send(messageData);
    })
    .catch((error) => res.send("NOT FOUND"));
}

server.post("/addproducts", addproductsHandler);

function addproductsHandler(req, res) {
  cartModel
    .find({ email: req.query.email })
    .then((productseData) => {
      productseData[0].products.push(req.body);
      productseData[0].save();
      res.send(productseData[0]);
    })
    .catch((error) => res.send("NOT FOUND"));
}

server.post("/removeproducts", removeproductsHandler);

function removeproductsHandler(req, res) {
  cartModel
    .find({ email: req.query.email })
    .then((productseData) => {
      let itemIndex = -1;
      productseData[0].products.find((ele, idx) => {
        console.log(ele.productName, req.body.productName);
        if (ele.productName === req.body.productName) {
          itemIndex = idx;
          return idx;
        }
      });
      if (itemIndex >= 0) {
        productseData[0].products.splice(itemIndex, 1);
        productseData[0].save();
      }
      res.send(productseData[0]);
    })
    .catch((error) => res.send("NOT FOUND"));
}

server.post("/clearproducts", clearproductsHandler);

function clearproductsHandler(req, res) {
  cartModel
    .find({ email: req.query.email })
    .then((productseData) => {
      productseData[0].products.splice(0, productseData[0].products.length);
      productseData[0].save();

      res.send(productseData[0]);
    })
    .catch((error) => res.send("NOT FOUND"));
}

server.listen(PORT, () => console.log(`listening on ${PORT}`));
