import logo from "../assets/logosite.png"

export default function Logo(props: { height?: number, width?: number }) {
    let { height, width } = props
    return (<>
        <img src={logo} alt="Image de Logo Ytasty Crousty" height={height} width={width}></img>
    </>
    )
}