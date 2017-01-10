using System;
using System.Drawing;
using System.Drawing.Imaging;

namespace FractalPlant
{
    class FractalPlant
    {
        private const int MaxRecursionLevel = 7;
        private const int InitialLineLength = 180;
        private const double InitialAngle = Math.PI / 2.0;
        private const double LineFactor = 0.7;
        private const double PenFactor = 0.7;
        private const double AngleFactor = 0.7;
        private const double InitialDeltaAngle = Math.PI / 3.0;

        static void Main(string[] args)
        {
            var bitmap = new Bitmap(900, 600);
            var graphics = Graphics.FromImage(bitmap);
            graphics.Clear(Color.White);
            var pen = new Pen(Color.DarkGreen);

            // Piirrä tasaisilla jaoilla luotu kasvi
            GrowPerfect(graphics, pen, bitmap.Width / 2, bitmap.Height, InitialAngle, 0);
            bitmap.Save("OutputPerfect.png", ImageFormat.Png);

            // Piirrä muutama kasvi lievästi satunnaisilla jaoilla
            for (int i = 0; i < 3; i++)
            {
                graphics.Clear(Color.White);
                var random = new Random(1359 + i); // Toistettavuuden vuoksi vakiosiemen
                GrowRandom(graphics, pen, random, bitmap.Width / 2, bitmap.Height, InitialAngle, 0);
                bitmap.Save($"OutputRandom{i}.png", ImageFormat.Png);
            }
        }

        private static void GrowPerfect(Graphics graphics, Pen pen, int startX, int startY, double angle, int recursionLevel)
        {
            // Lopeta rekursio riittävän monen iteraation jälkeen
            if (recursionLevel >= MaxRecursionLevel)
                return;

            // Piirrä tätä tasoa kuvaava viiva
            var lineLength = InitialLineLength * Math.Pow(LineFactor, recursionLevel);
            int endX = startX + (int)(Math.Cos(angle) * lineLength);
            int endY = startY - (int)(Math.Sin(angle) * lineLength); // Negaatio koska Y kasvaa alaspäin

            pen.Width = (float)(8.0 * Math.Pow(PenFactor, recursionLevel));
            graphics.DrawLine(pen, startX, startY, endX, endY);

            // Haaraudu edelleen kahteen osaan
            var deltaAngle = InitialDeltaAngle * Math.Pow(AngleFactor, recursionLevel + 1);

            GrowPerfect(graphics, pen, endX, endY, angle - deltaAngle, recursionLevel + 1);
            GrowPerfect(graphics, pen, endX, endY, angle + deltaAngle, recursionLevel + 1);
        }

        private static void GrowRandom(Graphics graphics, Pen pen, Random random, int startX, int startY, double angle, int recursionLevel)
        {
            // Lopeta rekursio riittävän monen iteraation jälkeen
            if (recursionLevel >= MaxRecursionLevel)
                return;

            // Piirrä tätä tasoa kuvaava viiva
            var randomLengthFactor = (random.NextDouble() - 0.5) * 0.4 + 1; // Välillä 0.8 .. 1.2
            var lineLength = InitialLineLength * Math.Pow(LineFactor, recursionLevel) * randomLengthFactor;
            int endX = startX + (int)(Math.Cos(angle) * lineLength);
            int endY = startY - (int)(Math.Sin(angle) * lineLength); // Negaatio koska Y kasvaa alaspäin

            pen.Width = (float)(8.0 * Math.Pow(PenFactor, recursionLevel));
            graphics.DrawLine(pen, startX, startY, endX, endY);

            // Haaraudu edelleen kahteen osaan
            var randomAngleFactor = (random.NextDouble() - 0.5) * 0.4 + 1; // Välillä 0.8 .. 1.2
            var deltaAngle = InitialDeltaAngle * Math.Pow(AngleFactor, recursionLevel + 1) * randomAngleFactor;

            GrowRandom(graphics, pen, random, endX, endY, angle - deltaAngle, recursionLevel + 1);
            GrowRandom(graphics, pen, random, endX, endY, angle + deltaAngle, recursionLevel + 1);
        }
    }
}
