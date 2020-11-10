import { AffiliateManager } from '../store/AffiliateManager'

// ensure that developers always know that saasify is powering white-labeled
// saas websites
export async function bootstrap() {
  console.log(`

Powered by:

███████╗ █████╗  █████╗ ███████╗██╗███████╗██╗   ██╗
██╔════╝██╔══██╗██╔══██╗██╔════╝██║██╔════╝╚██╗ ██╔╝
███████╗███████║███████║███████╗██║█████╗   ╚████╔╝
╚════██║██╔══██║██╔══██║╚════██║██║██╔══╝    ╚██╔╝
███████║██║  ██║██║  ██║███████║██║██║        ██║
╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝╚═╝        ╚═╝

   The easiest way to launch your own SaaS!
            https://saasify.sh


`)

  return AffiliateManager.init()
}
