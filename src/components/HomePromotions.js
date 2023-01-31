import promo1 from '../assets/itemimages/promo1.png'
import { useIsMobile } from '../hooks/useIsMobile'

export default function HomePromotions() {

    const { isMobile } = useIsMobile()

  return (
    <section className={`home-promotions container bg-green p-3 flex-${isMobile ? "col" : "row"}-center-between`}>
        <img src={promo1} alt="" />
        <div className="promo-text-container flex-col-center-start">
            <p className="title">Inventory Clearance Sale</p>
            {/* <p className="huge-title text-red">50% OFF</p> */}
            <div className="huge-title-with-subtitle flex-col-center-center">
                <p className="title text-red">50% OFF</p>
                <p className="subtitle text-red">on everything</p>
            </div>
            <p className="title">Real Deals for EVERYONE and EVERYTHING</p>
            <p className="subtitle mt-2">Items Include: Placemats, coasters, all kinds of Wall Hanging, Plant Hangers, Sandals and Earrings</p>
            <p className="subtitle">Promotions last till we have stocks</p>
        </div>
    </section>
  )
}
