import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useStyles } from './styles'
import { colors, typography } from '@static/theme'
import FAQ1 from '@static/png/faq-1.png'
import FAQ2 from '@static/png/faq-2.png'
const faqData = [
  {
    question: 'What is Invariant Points?',
    answer:
      'Invariant Points is a program designed to incentivize Invariant liquidity providers. Earn points by providing liquidity, completing tasks, and through referrals(coming soon). Accumulated points can be used for future exclusive benefits.'
  },
  {
    question: 'How do I earn points?',
    answer:
      'At the moment, providing liquidity in the ETH/USDC pool will earn you points. The more efficient(concentrated) your liquidity is, the more points you’ll earn. In the future, we plan to introduce additional ways to earn points.'
  },
  {
    question: 'How are points calculated?',
    answer: `In short: </br> <ul><li>The larger the position, the more points you earn.</li><li>The narrower the range of the position (higher concentration), the more points you earn.</li><li>The longer the position remains active, the more points you accumulate.</li><li>The wider the position, the more consistent your point earnings become.</li></ul>The exact formula for calculating points is explained in detail in our docs - <a href="https://docs.invariant.app/docs/tutorial/get_started" target="_blank" style="text-decoration-color: #2EE09A"><span style="color: #2EE09A">CLICK HERE!<span></a>`
  },
  {
    question: 'On which blockchain can I earn points?',
    answer: 'Currently, only on Eclipse.'
  },
  {
    question: 'How long will points continue?',
    answer: 'Invariant Points will run through 2025, with no specific end date defined yet.'
  },
  {
    question: 'Do I get rewarded for being an early user?',
    answer:
      'Hell yeah. Our algorithm is designed in such a way as to appreciate OG users. A constant number of points is distributed every second and shared across all positions. As the number of positions increases, the number of points received by each one decreases, so it pays off to be early. One dollar in a position now might be worth as much as 30 dollars in the future.'
  },
  {
    question: 'What are the rewards, and when will we receive them?',
    answer: `There will be at least a few airdrops, and the allocation for each will depend on the number of points you've accrued. Airdrops will be unannounced and distributed at different times, so it’s worth staying as high in the rankings as possible at all times.`
  },
  {
    question: `If i'm not a whale, do i still have a chance at being competitive points?`,
    answer:
      'Yes. Even though TVL and duration are important factors, there will be opportunities throughout the program to earn boosts and additional points. Active participation and quick reflexes will be rewarded.'
  },
  {
    question: `Which pair should I add liquidity to?`,
    answer: 'ETH/USDC'
  },
  {
    question: `I don't understand how the points distribution works. Could you explain it to me?`,
    answer: `    
      Sure! Here is the explanation with a graphic example.
      You create two positions in a <b>USDC/USDT</b> pool with a price of <b>1 USDC per USDT</b>.
      (*Both positions contribute an equal amount of tokens to the pool.)
      <ul>
      <li><b>Position 1</b>: Narrow range (<b>0.9999 - 1.0001</b>).</li>
      <li>Position 2: Wider range (<b>0.9995 - 1.0005</b>).</li>
      </ul>
      When both positions are active:
      <ul>
      <li>Position 1 receives only <b>⅙</b> (1000 points) of the distributed points due to its wider range.</li>
      </ul>
      Position 2 receives <b>⅚</b> (5000 points) of the distributed points due to its narrower range (higher concentration).
      <img src="${FAQ1}" /></br>

      If the price moves to <b>1.0004</b>:
      <ul>
      <li>
      Position 1 becomes the sole active position and collects all distributed points(6000 points) during this time.
      </li>
      </ul>
      Position 2 is no longer active (falls out of range, not collecting fee and accruing points).
      <img src="${FAQ2}" />
    
    `
  },
  {
    question: `I'm new to providing liquidity, how can I learn how to do it correctly?`,
    answer:
      'No worries, everyone started somewhere. You can start by reading our docs about concentrated liquidity provision here'
  },
  {
    question: `I'm new to CLMM(Concentrated Liquidity Market Maker), but I was previously a provider in the classic AMM model. What to do?`,
    answer: `If you're not familiar with concentrated liquidity but want to start earning points right away, we recommend creating a full-range position (similar to classic AMM) while getting acquainted with the concentrated liquidity model, as providing liquidity in this model will earn you the most points.`
  },
  {
    question: `My position is out of range and isn’t earning points. What should I do?`,
    answer: `It's a normal situation in concentrated liquidity. You should rebalance your position, which means you need to close it and open it again within a new price range.`
  },
  {
    question: `How to contact us?`,
    answer: `You can contact us via: </br> <ul><li>Discord (<a href="https://discord.com/invite/w6hTeWTJvG" style="color: #2EE09A">CLICK!</a>)</li><li>Email (<a href="mailto:contact@invariant.app" style="color: #2EE09A">CLICK!</a>)</li><li>X (<a href="https://x.com/invariant_labs" style="color: #2EE09A">CLICK!</a>)</li></ul><p>The Terms and Conditions of the Invariant Points Program are available <a href="https://docs.invariant.app/docs/points_terms" style="color: #2EE09A">here</a></p>`
  }
]

export const Faq = () => {
  const { classes } = useStyles()

  return (
    <div className={classes.container}>
      {faqData.map((item, index) => (
        <Accordion
          key={index}
          sx={{
            backgroundColor: 'transparent',
            boxShadow: 'none',
            '&:before': {
              display: 'none'
            },
            '&:not(:last-child)': {
              borderBottom: `1px solid ${colors.invariant.light}`
            }
          }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: colors.invariant.light }} />}
            sx={{
              padding: '16px 0',
              '& .MuiAccordionSummary-content': {
                margin: 0
              }
            }}>
            <Typography
              sx={{
                color: colors.invariant.text,
                fontSize: '16px',
                fontWeight: 500
              }}>
              {item.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              padding: '0 0 16px 0'
            }}
            className={classes.item}>
            <Typography
              dangerouslySetInnerHTML={{ __html: item.answer }}
              sx={{
                color: colors.invariant.textGrey,
                ...typography.body2,
                fontWeight: 400,
                lineHeight: '20px',
                fontSize: '16px',
                opacity: 0.8
              }}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}
