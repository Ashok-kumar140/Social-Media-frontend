
const ParallaxBG = ({ url, children = "SOCIAL MEDIA" }) => {

    return (
        <div className="container-fluid clip"
            style={{
                backgroundImage: "url( " + url + ")",
                backgroundAttachment: "fixed",
                padding: "100px 0px 75px 0px",
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'top 30%',
                // display: 'block',
                objectFit:'cover',
                // objectPositin:'center top',
                // height:'70vh',
                // width:'100%',
                // maxHeight:'90%'
            }}>
            <h1 className="display-1 font-weight-bold text-center">{children}</h1>

        </div>
    );
};
export default ParallaxBG;