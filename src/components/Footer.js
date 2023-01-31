
import { useIsMobile } from "../hooks/useIsMobile"
import { scrollToTop } from '../helper/helper'
import { useAuthContext } from "../hooks/useAuthContext"

export default function Footer() {

    const { theme } = useAuthContext()
    const { isMobile } = useIsMobile()

  return (
    <footer onClick={() => scrollToTop()} className={`footer text-white flex-row-center-${isMobile ? "center mobile" : "between"} ${theme === "dark" ? "bg-darkaccent" : "bg-pink"}`}>
      {!isMobile && <span>Terms and Conditions</span>}
      <span className="flex-row-center-center"><span className="big">®</span><span className="font-aureta">Knots of Love</span>&nbsp; by &nbsp;<b>Kaye™</b> &nbsp;&nbsp; ©2023</span>
      {!isMobile && <span >Back to Top</span>}
    </footer>
  )
}
